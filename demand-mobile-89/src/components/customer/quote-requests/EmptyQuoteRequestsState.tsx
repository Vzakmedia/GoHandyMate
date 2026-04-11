
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MessageSquare } from 'lucide-react';

export const EmptyQuoteRequestsState = () => (
  <Card className="border-black/5 rounded-[2rem] overflow-hidden shadow-none py-12">
    <CardContent className="text-center">
      <div className="space-y-4">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
          <MessageSquare className="w-8 h-8 text-slate-300" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Quote Requests Yet</h3>
          <p className="text-slate-500 font-medium mb-8 max-w-sm mx-auto">
            You haven't created any quote requests yet. Get started by requesting a custom quote for your project.
          </p>
          <Button className="bg-[#166534] hover:bg-[#14532d] rounded-full px-8 h-11 text-[10px] font-black uppercase tracking-widest transition-all">
            <Plus className="w-4 h-4 mr-2" />
            Create Quote Request
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);
