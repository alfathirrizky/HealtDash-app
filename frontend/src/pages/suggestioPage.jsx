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
                                <TableHead className="text-blue-600 font-semibold">Image</TableHead>
                                <TableHead className="text-blue-600 font-semibold">Caption</TableHead>
                                <TableHead className="text-blue-600 font-semibold">Description</TableHead>
                                <TableHead className="text-blue-600 font-semibold">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {suggestions.length > 0 ? (
                                suggestions.map((content) => (
                                    <TableRow
                                        key={content.id}
                                        className="hover:bg-blue-50 transition border-b border-gray-400"
                                    >
                                        <TableCell>
                                            <img
                                                src={`http://localhost:5000/uploads/${content.image}`}
                                                alt={content.caption}
                                                className="w-40 h-20 object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.src = "/no-image.png";
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>{content.caption}</TableCell>
                                        <TableCell>{content.description}</TableCell>
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