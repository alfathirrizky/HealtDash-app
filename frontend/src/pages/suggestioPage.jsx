import useSuggestions from "@/hooks/useSugestions";
import {
  Table, TableBody, TableCaption, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table"
import Load from "../components/load"

export default function SuggestioPage() {
    const { suggestions } = useSuggestions();
    
    return (
        <div>
            <div className="border border-blue-200 rounded-xl p-3 bg-white">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-blue-50 border-b border-blue-100">
                                <TableHead className="text-blue-600 font-semibold">Username</TableHead>
                                <TableHead className="text-blue-600 font-semibold">Message</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {suggestions.length > 0 ? (
                                suggestions.map((suggestion) => (
                                    <TableRow
                                        key={suggestion.sugestion_id}
                                        className="hover:bg-blue-50 transition border-b border-gray-400"
                                    >
                                        <TableCell>{suggestion.name}</TableCell>
                                        <TableCell>{suggestion.pesan}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan="8">
                                        <div className="flex flex-col items-center justify-center py-20 gap-6">
                                            <Load className="w-30 h-30 " />
                                            <p className="text-blue-500 font-medium text-lg">
                                                No Suggestions Found
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
            </div>
        </div>
    );
}