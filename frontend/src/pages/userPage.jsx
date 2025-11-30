import API from "../api/api"
import { useState, useEffect } from "react"
import {
  Table, TableBody, TableCaption, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { motion } from "framer-motion";
import Load from "../components/load"
import { toast } from "sonner"


export default function UserPage() {
    const [users, setUsers] = useState([])
    const [open, setOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState({ name: "", email: "" })

    const fetchUser = async () => {
        const res = await API.get('/users')
        setUsers(res.data)
    }

    useEffect(() => {
        fetchUser()
    }, [])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleCreate = async () => {
        const res = await API.post("/users", form)
        setUsers(prev => [res.data, ...prev])
        setOpen(false)
        setForm({ name: "", email: "" })
    }

    const handleUpdate = async () => {
        const res = await API.put(`/users/${editing.id}`, form)
        setUsers(prev => prev.map(u => (u.id === editing.id ? res.data : u)))
        setOpen(false)
        setEditing(null)
        setForm({ name: "", email: "" })
    }

    const handleDelete = async (id) => {
        await API.delete(`/users/${id}`)
        setUsers(prev => prev.filter(u => u.id !== id))
        toast.error("User berhasil dihapus.")
    }

    const openEditForm = (user) => {
        setEditing(user)
        setForm({ name: user.name, email: user.email })
        setOpen(true)
    }

    const openCreateForm = () => {
        setEditing(null)
        setForm({ name: "", email: "" })
        setOpen(true)
    }

    return (
        <div className="space-y-4 p-5">
            <div className="flex flex-col gap-5 scrollbar-none scroll-smooth overflow-y-auto h-[89vh]">
                <div className=" flex gap-5">
                    <Button
                        onClick={openCreateForm}
                        className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                    >
                        Create User
                    </Button>
                        <div className="w-full md:w-1/3">
                            <input
                                type="text"
                                placeholder="Search user..."
                                // value={search}
                                // onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                            />
                        </div>
                </div>
                {/* TABLE */}
                <div className="border border-blue-200 rounded-xl p-3 bg-white">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-blue-50 border-b border-blue-100">
                                <TableHead className="text-blue-700 font-semibold">ID</TableHead>
                                <TableHead className="text-blue-700 font-semibold">Name</TableHead>
                                <TableHead className="text-blue-700 font-semibold">Email</TableHead>
                                <TableHead className="text-blue-700 font-semibold">Telepon</TableHead>
                                <TableHead className="text-blue-700 font-semibold">Position</TableHead>
                                <TableHead className="text-blue-700 font-semibold">Gender</TableHead>
                                <TableHead className="text-blue-700 font-semibold">Role</TableHead>
                                <TableHead className="text-blue-700 font-semibold">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <TableRow
                                        key={user.id}
                                        className="hover:bg-blue-50 transition border-b border-gray-400"
                                    >
                                        <TableCell>{user.id}</TableCell>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.telepon}</TableCell>
                                        <TableCell>{user.position}</TableCell>
                                        <TableCell>{user.gender}</TableCell>
                                        <TableCell>{user.role}</TableCell>
                                        <TableCell className="space-x-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-blue-500 text-blue-600 hover:bg-blue-100"
                                                onClick={() => openEditForm(user)}
                                            >
                                                Edit
                                            </Button>
                                            <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                size="sm"
                                                variant="destructive"
                                                className="bg-red-500 hover:bg-red-600"
                                                >
                                                Delete
                                                </Button>
                                            </AlertDialogTrigger>

                                            <AlertDialogContent className="bg-white shadow-xl rounded-xl p-0 overflow-hidden">

                                                {/* Animasi popup */}
                                                <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.25, ease: "easeOut" }}
                                                className="p-6"
                                                >
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="text-gray-900">
                                                    Konfirmasi Hapus
                                                    </AlertDialogTitle>

                                                    <AlertDialogDescription className="text-gray-600">
                                                    Apakah Anda yakin ingin menghapus user ini? Tindakan ini tidak dapat
                                                    dibatalkan.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>

                                                <AlertDialogFooter className="mt-6">
                                                    <AlertDialogCancel className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                                                    Batal
                                                    </AlertDialogCancel>

                                                    <AlertDialogAction
                                                    className="bg-red-500 hover:bg-red-600 text-white"
                                                    onClick={() => handleDelete(user.id)}
                                                    >
                                                    Ya, Hapus
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                                </motion.div>
                                            </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan="4">
                                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                                            <Load className="w-30 h-30" />
                                            <p className="text-blue-700 font-medium text-lg">
                                                No users found
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                {/* POP-UP FORM */}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="bg-white border border-blue-200 shadow-xl rounded-xl">
                    <DialogHeader>
                        <DialogTitle className="text-blue-700 font-semibold">
                        {editing ? "Edit User" : "Create User"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-3">
                        <Input
                        placeholder="Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="border-blue-300 focus:ring-blue-500"
                        />
                        <Input
                        placeholder="Email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="border-blue-300 focus:ring-blue-500"
                        />

                        <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
                        onClick={editing ? handleUpdate : handleCreate}
                        >
                        {editing ? "Update" : "Create"}
                        </Button>
                    </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
