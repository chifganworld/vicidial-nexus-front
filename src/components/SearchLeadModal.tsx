
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Search, UserCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Lead = Database['public']['Tables']['leads']['Row'];

interface SearchLeadModalProps {
  onLeadSelect: (lead: Lead) => void;
}

const SearchLeadModal: React.FC<SearchLeadModalProps> = ({ onLeadSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Lead[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchResults([]);

    const { data, error } = await supabase
      .from('leads')
      .select()
      .or(`name.ilike.%${searchQuery}%,phone_number.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
      .limit(10);

    setIsSearching(false);

    if (error) {
      toast({ title: "Search Error", description: error.message, variant: "destructive" });
    } else {
      setSearchResults(data || []);
      if (!data || data.length === 0) {
        toast({ title: "No results found", description: `No leads matched your search for "${searchQuery}".` });
      }
    }
  };

  const handleLeadClick = (lead: Lead) => {
    onLeadSelect(lead);
    setSearchQuery('');
    setSearchResults([]);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Search className="mr-2 h-4 w-4" /> Search Lead
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Search Lead</DialogTitle>
          <DialogDescription>
            Enter the name, phone, or email of the lead you want to find.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSearchSubmit}>
          <div className="flex items-center space-x-2">
            <Input
              id="searchQuery"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Enter search term..."
              required
            />
            <Button type="submit" size="sm" disabled={isSearching}>
              {isSearching ? '...' : <Search className="h-4 w-4" />}
            </Button>
          </div>
        </form>
        <div className="mt-4 max-h-60 overflow-y-auto">
          {searchResults.length > 0 && (
            <ul className="space-y-2">
              {searchResults.map((lead) => (
                <li key={lead.id}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-auto text-left"
                    onClick={() => handleLeadClick(lead)}
                  >
                    <UserCheck className="mr-2 h-4 w-4 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">{lead.name || 'Unnamed Lead'}</p>
                      <p className="text-xs text-muted-foreground">{lead.phone_number}</p>
                    </div>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SearchLeadModal;
