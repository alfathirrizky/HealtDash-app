import API from "../api/api"
import useUser from "../hooks/useUser"
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
import { ArrowUpIcon, Search } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function UserPage() {
    const {
        users,
        open,
        editing,
        form,
        openEditForm,
        handleChange,
        handleCreate,
        handleUpdate,
        handleDelete,
        setOpen,
    } = useUser();


    return (
        <div className="space-y-4 p-5">
            <div className="flex flex-col gap-5 scrollbar-none scroll-smooth overflow-y-auto h-[89vh]">
                <div className=" flex w-full items-center justify-between gap-5">
                    <h1 className=" font-bold text-4xl">User Dashboard</h1>
                    <div className=" flex gap-4 w-2xl justify-end">
                        <div className="w-full md:w-1/3">
                                <InputGroup>
                                <InputGroupInput placeholder="Search..." />
                                <InputGroupAddon>
                                    <Search/>
                                </InputGroupAddon>
                                </InputGroup>
                        </div>
                        <Link to="/users/create">
                            <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
                                Create User
                            </Button>
                        </Link>
                    </div>
                </div>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/user">User</Link>
                        </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                    </BreadcrumbList>
                </Breadcrumb>
                {/* TABLE */}
                <div className="border border-blue-200 rounded-xl p-3 bg-white">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-blue-50 border-b border-blue-100">
                                <TableHead className="text-blue-600 font-semibold">ID</TableHead>
                                <TableHead className="text-blue-600 font-semibold">Image</TableHead>
                                <TableHead className="text-blue-600 font-semibold">Name</TableHead>
                                <TableHead className="text-blue-600 font-semibold">Email</TableHead>
                                <TableHead className="text-blue-600 font-semibold">Telepon</TableHead>
                                <TableHead className="text-blue-600 font-semibold">Position</TableHead>
                                <TableHead className="text-blue-600 font-semibold">Gender</TableHead>
                                <TableHead className="text-blue-600 font-semibold">Role</TableHead>
                                <TableHead className="text-blue-600 font-semibold">Password</TableHead>
                                <TableHead className="text-blue-600 font-semibold">Actions</TableHead>
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
                                        <TableCell>{user.image}</TableCell>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.telepon}</TableCell>
                                        <TableCell>{user.position}</TableCell>
                                        <TableCell>{user.gender}</TableCell>
                                        <TableCell>{user.role}</TableCell>
                                        <TableCell>{user.password}</TableCell>
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
                                    <TableCell colSpan="8">
                                        <div className="flex flex-col items-center justify-center py-20 gap-6">
                                            <Load className="w-30 h-30 " />
                                            <p className="text-blue-500 font-medium text-lg">
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
                <DialogContent className="bg-white border border-blue-200 shadow-xl rounded-xl w-2xl">
                    <DialogHeader>
                    <DialogTitle className="text-blue-700 font-semibold">
                        {editing ? "Edit User" : "Create User"}
                    </DialogTitle>
                    </DialogHeader>

                    <div className="grid grid-cols-3 gap-3 py-2">
                    <Input
                        placeholder="Id"
                        name="id"
                        value={form.id}
                        onChange={handleChange}
                        className="border-blue-300 focus:ring-blue-500"
                    />

                    <Input
                        placeholder="Image"
                        name="image"
                        value={form.image}
                        onChange={handleChange}
                        className="border-blue-300 focus:ring-blue-500"
                    />

                    <Input
                        placeholder="Telepon"
                        name="telepon"
                        value={form.telepon}
                        onChange={handleChange}
                        className="border-blue-300 focus:ring-blue-500"
                    />

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

                    <Input
                        placeholder="Position"
                        name="position"
                        value={form.position}
                        onChange={handleChange}
                        className="border-blue-300 focus:ring-blue-500"
                    />

                    <Input
                        placeholder="Gender"
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        className="border-blue-300 focus:ring-blue-500"
                    />

                    <Input
                        placeholder="Password"
                        name="password"
                        value={form.password}
                        type="password"
                        onChange={handleChange}
                        className="border-blue-300 focus:ring-blue-500"
                    />

                    <Input
                        placeholder="Role"
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        className="border-blue-300 focus:ring-blue-500"
                    />
                    </div>

                    <div className="pt-4">
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
