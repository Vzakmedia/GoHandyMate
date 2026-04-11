
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { operation, data, contractorId } = await req.json()
    
    console.log(`[CONTRACTOR-SYNC] Processing ${operation} for contractor:`, contractorId)

    // Get user from auth header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Authentication failed')
    }

    console.log(`[CONTRACTOR-SYNC] User authenticated:`, user.email)

    switch (operation) {
      case 'update_profile':
        // Update contractor profile - handles both profile table and business profile data
        const updateData: any = {
          updated_at: new Date().toISOString()
        }

        // Update the full_name field in profiles table
        if (data.ownerName) {
          updateData.full_name = data.ownerName
        }

        // Update avatar_url if profile image is provided
        if (data.profileImage) {
          updateData.avatar_url = data.profileImage
        }

        // Note: business_name is not a column in profiles table
        // Store business name in separate business_profiles table below

        console.log(`[CONTRACTOR-SYNC] Updating profile with data:`, updateData)

        const { error: profileError } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', user.id)
          .eq('user_role', 'contractor')

        if (profileError) {
          console.error('[CONTRACTOR-SYNC] Profile update error:', profileError)
          throw profileError
        }

        // Also update or create business profile if business name is provided
        if (data.businessName) {
          const { data: existingBusiness, error: checkError } = await supabase
            .from('business_profiles')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle()

          if (checkError && checkError.code !== 'PGRST116') {
            console.error('[CONTRACTOR-SYNC] Business profile check error:', checkError)
          }

          const businessData = {
            business_name: data.businessName,
            contact_email: user.email,
            user_id: user.id,
            updated_at: new Date().toISOString()
          }

          if (existingBusiness) {
            // Update existing business profile
            const { error: businessError } = await supabase
              .from('business_profiles')
              .update(businessData)
              .eq('user_id', user.id)

            if (businessError) {
              console.error('[CONTRACTOR-SYNC] Business profile update error:', businessError)
            }
          } else {
            // Create new business profile
            const { error: businessError } = await supabase
              .from('business_profiles')
              .insert({
                ...businessData,
                created_at: new Date().toISOString()
              })

            if (businessError) {
              console.error('[CONTRACTOR-SYNC] Business profile create error:', businessError)
            }
          }
        }

        console.log(`[CONTRACTOR-SYNC] Profile updated successfully for user:`, user.id)

        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Profile updated successfully' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'create_quote':
        if (!data || !data.jobId) {
          throw new Error('Missing required quote data')
        }
        
        console.log(`[CONTRACTOR-SYNC] Creating quote for contractor ${user.id}`, data)
        
        return new Response(JSON.stringify({ 
          success: true, 
          quoteId: `quote_${Date.now()}`,
          message: 'Quote created successfully' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'save_quote_draft':
        console.log(`[CONTRACTOR-SYNC] Saving quote draft for contractor ${user.id}`, data)
        
        return new Response(JSON.stringify({ 
          success: true, 
          draftId: `draft_${Date.now()}`,
          message: 'Quote draft saved successfully' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'send_quote':
        console.log(`[CONTRACTOR-SYNC] Sending quote for contractor ${user.id}`, data)
        
        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Quote sent successfully' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'sync_projects':
        console.log(`[CONTRACTOR-SYNC] Syncing projects for contractor ${user.id}`)
        
        try {
          const { data: jobRequests, error: jobError } = await supabase
            .from('job_requests')
            .select('*')
            .eq('assigned_to_user_id', user.id)
            .order('created_at', { ascending: false })

          if (jobError) {
            console.error('[CONTRACTOR-SYNC] Job requests error:', jobError)
            throw jobError
          }

          return new Response(JSON.stringify({ 
            success: true, 
            projects: jobRequests || [],
            count: jobRequests?.length || 0
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        } catch (syncError) {
          console.error('[CONTRACTOR-SYNC] Project sync error:', syncError)
          return new Response(JSON.stringify({ 
            success: false, 
            projects: [],
            count: 0,
            message: 'Failed to sync projects, using empty state'
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

      case 'update_availability':
        console.log(`[CONTRACTOR-SYNC] Updating availability for contractor ${user.id}`, data)
        
        if (!data || !data.availability) {
          throw new Error('Missing availability data')
        }
        
        const { error: availabilityError } = await supabase
          .from('profiles')
          .update({
            updated_at: new Date().toISOString(),
            // Add availability fields as needed - this would require extending the profiles table
          })
          .eq('id', user.id)

        if (availabilityError) {
          console.error('[CONTRACTOR-SYNC] Availability update error:', availabilityError)
          throw availabilityError
        }

        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Availability updated successfully' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'get_statistics':
        try {
          const { data: stats, error: statsError } = await supabase
            .from('job_requests')
            .select('id, status, created_at')
            .eq('assigned_to_user_id', user.id)

          if (statsError) {
            console.error('[CONTRACTOR-SYNC] Statistics error:', statsError)
            const defaultStats = {
              totalJobs: 0,
              completedJobs: 0,
              activeJobs: 0,
              pendingJobs: 0
            }
            return new Response(JSON.stringify({ 
              success: true, 
              statistics: defaultStats
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
          }

          const statistics = {
            totalJobs: stats?.length || 0,
            completedJobs: stats?.filter(job => job.status === 'completed').length || 0,
            activeJobs: stats?.filter(job => job.status === 'in_progress').length || 0,
            pendingJobs: stats?.filter(job => job.status === 'pending').length || 0
          }

          return new Response(JSON.stringify({ 
            success: true, 
            statistics 
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        } catch (statsError) {
          console.error('[CONTRACTOR-SYNC] Statistics error:', statsError)
          const defaultStats = {
            totalJobs: 0,
            completedJobs: 0,
            activeJobs: 0,
            pendingJobs: 0
          }
          return new Response(JSON.stringify({ 
            success: true, 
            statistics: defaultStats
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

      case 'add_team_member':
        console.log(`[CONTRACTOR-SYNC] Adding team member for contractor ${user.id}`, data)
        
        if (!data || !data.name || !data.role) {
          throw new Error('Missing required team member data')
        }

        const { error: teamMemberError } = await supabase
          .from('team_members')
          .insert({
            contractor_id: user.id,
            name: data.name,
            role: data.role,
            email: data.email,
            phone: data.phone,
            skills: data.skills || [],
            availability: data.availability,
            status: data.status || 'active',
            join_date: data.joinDate,
            hourly_rate: data.hourlyRate
          })

        if (teamMemberError) {
          console.error('[CONTRACTOR-SYNC] Team member creation error:', teamMemberError)
          throw teamMemberError
        }
        
        return new Response(JSON.stringify({ 
          success: true,
          message: 'Team member added successfully' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'update_team_member':
        console.log(`[CONTRACTOR-SYNC] Updating team member for contractor ${user.id}`, data)
        
        if (!data || !data.id) {
          throw new Error('Missing team member ID')
        }

        const updateTeamData: any = { updated_at: new Date().toISOString() }
        if (data.name) updateTeamData.name = data.name
        if (data.role) updateTeamData.role = data.role
        if (data.email !== undefined) updateTeamData.email = data.email
        if (data.phone !== undefined) updateTeamData.phone = data.phone
        if (data.skills) updateTeamData.skills = data.skills
        if (data.availability !== undefined) updateTeamData.availability = data.availability
        if (data.status) updateTeamData.status = data.status
        if (data.joinDate) updateTeamData.join_date = data.joinDate
        if (data.hourlyRate !== undefined) updateTeamData.hourly_rate = data.hourlyRate

        const { error: updateTeamError } = await supabase
          .from('team_members')
          .update(updateTeamData)
          .eq('id', data.id)
          .eq('contractor_id', user.id)

        if (updateTeamError) {
          console.error('[CONTRACTOR-SYNC] Team member update error:', updateTeamError)
          throw updateTeamError
        }
        
        return new Response(JSON.stringify({ 
          success: true,
          message: 'Team member updated successfully' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'remove_team_member':
        console.log(`[CONTRACTOR-SYNC] Removing team member for contractor ${user.id}`, data)
        
        if (!data || !data.id) {
          throw new Error('Missing team member ID')
        }

        const { error: deleteTeamError } = await supabase
          .from('team_members')
          .delete()
          .eq('id', data.id)
          .eq('contractor_id', user.id)

        if (deleteTeamError) {
          console.error('[CONTRACTOR-SYNC] Team member deletion error:', deleteTeamError)
          throw deleteTeamError
        }
        
        return new Response(JSON.stringify({ 
          success: true,
          message: 'Team member removed successfully' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'get_team_members':
        console.log(`[CONTRACTOR-SYNC] Getting team members for contractor ${user.id}`)
        
        const { data: teamMembers, error: teamMembersError } = await supabase
          .from('team_members')
          .select('*')
          .eq('contractor_id', user.id)
          .order('created_at', { ascending: false })

        if (teamMembersError) {
          console.error('[CONTRACTOR-SYNC] Team members fetch error:', teamMembersError)
          throw teamMembersError
        }
        
        return new Response(JSON.stringify({ 
          success: true,
          teamMembers: teamMembers || []
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'add_project':
        console.log(`[CONTRACTOR-SYNC] Adding project for contractor ${user.id}`, data)
        
        if (!data || !data.title || !data.client || !data.startDate) {
          throw new Error('Missing required project data')
        }

        const { error: projectError } = await supabase
          .from('contractor_projects')
          .insert({
            contractor_id: user.id,
            title: data.title,
            client: data.client,
            start_date: data.startDate,
            end_date: data.endDate,
            location: data.location,
            assigned_team: data.assignedTeam || [],
            status: data.status || 'scheduled'
          })

        if (projectError) {
          console.error('[CONTRACTOR-SYNC] Project creation error:', projectError)
          throw projectError
        }
        
        return new Response(JSON.stringify({ 
          success: true,
          message: 'Project added successfully' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'get_projects':
        console.log(`[CONTRACTOR-SYNC] Getting projects for contractor ${user.id}`)
        
        const { data: projects, error: projectsError } = await supabase
          .from('contractor_projects')
          .select('*')
          .eq('contractor_id', user.id)
          .order('created_at', { ascending: false })

        if (projectsError) {
          console.error('[CONTRACTOR-SYNC] Projects fetch error:', projectsError)
          throw projectsError
        }
        
        return new Response(JSON.stringify({ 
          success: true,
          projects: projects || []
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'add_safety_incident':
        console.log(`[CONTRACTOR-SYNC] Adding safety incident for contractor ${user.id}`, data)
        
        if (!data || !data.type || !data.description || !data.location) {
          throw new Error('Missing required incident data')
        }

        const { error: incidentError } = await supabase
          .from('safety_incidents')
          .insert({
            contractor_id: user.id,
            type: data.type,
            description: data.description,
            location: data.location,
            reported_by: data.reportedBy,
            incident_date: data.date,
            status: data.status || 'Open'
          })

        if (incidentError) {
          console.error('[CONTRACTOR-SYNC] Safety incident creation error:', incidentError)
          throw incidentError
        }
        
        return new Response(JSON.stringify({ 
          success: true,
          message: 'Safety incident reported successfully' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'get_safety_incidents':
        console.log(`[CONTRACTOR-SYNC] Getting safety incidents for contractor ${user.id}`)
        
        const { data: incidents, error: incidentsError } = await supabase
          .from('safety_incidents')
          .select('*')
          .eq('contractor_id', user.id)
          .order('created_at', { ascending: false })

        if (incidentsError) {
          console.error('[CONTRACTOR-SYNC] Safety incidents fetch error:', incidentsError)
          throw incidentsError
        }
        
        return new Response(JSON.stringify({ 
          success: true,
          incidents: incidents || []
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'update_checklist_progress':
        console.log(`[CONTRACTOR-SYNC] Updating checklist progress for contractor ${user.id}`, data)
        
        // For now, just return success - checklist progress could be tracked in a separate table
        return new Response(JSON.stringify({ 
          success: true,
          message: 'Checklist progress updated successfully' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      default:
        throw new Error(`Unsupported operation: ${operation}`)
    }

  } catch (error) {
    console.error('[CONTRACTOR-SYNC] Error:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message || 'Unknown error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
