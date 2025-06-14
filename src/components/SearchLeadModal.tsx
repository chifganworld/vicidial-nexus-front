
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
import { Search } from 'lucide-react';

const SearchLeadModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd perform the search operation here
    console.log('Search Query:', searchQuery);
    toast({
      title: 'Search Initiated',
      description: `Searching for: ${searchQuery}`,
      variant: 'default',
    });
    // Potentially close dialog or display results within it
    // setIsOpen(false); 
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Search className="mr-2 h-4 w-4" /> Search Lead
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Search Lead</DialogTitle>
          <DialogDescription>
            Enter the name, phone, or email of the lead you want to find.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSearchSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="searchQuery" className="text-right">
                Search
              </Label>
              <Input
                id="searchQuery"
                value={searchQuery}
                onChange={handleSearchChange}
                className="col-span-3"
                placeholder="Enter search term..."
                required
              />
            </div>
            {/* Future: Display search results here */}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Search</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SearchLeadModal;
