// ============================================================
// GoHandyMate Edge Function: send-notification
// Triggered by booking/message events to send push notifications
// ============================================================
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { user_id, title, body, type, reference_id, reference_table } = await req.json();

    if (!user_id || !title || !body) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: user_id, title, body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert notification record
    const { data: notification, error: notifError } = await supabase
      .from("notifications")
      .insert({
        user_id,
        title,
        body,
        type: type ?? "system",
        reference_id: reference_id ?? null,
        reference_table: reference_table ?? null,
        is_read: false,
      })
      .select()
      .single();

    if (notifError) {
      throw notifError;
    }

    // TODO: Integrate with Expo Push Notifications or Firebase FCM
    // Example with Expo Push:
    // const { data: profile } = await supabase
    //   .from("profiles")
    //   .select("expo_push_token")
    //   .eq("id", user_id)
    //   .single();
    //
    // if (profile?.expo_push_token) {
    //   await fetch("https://exp.host/--/api/v2/push/send", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       to: profile.expo_push_token,
    //       title,
    //       body,
    //       data: { type, reference_id },
    //     }),
    //   });
    // }

    return new Response(
      JSON.stringify({ success: true, notification }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
