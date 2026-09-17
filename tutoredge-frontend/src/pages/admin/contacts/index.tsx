import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  Calendar,
  MessageSquare,
} from "lucide-react";

import AdminDashboardLayout from "@/components/admin-dashboard/AdminDashboardLayout";
import adminApi from "@/lib/adminApi";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/* ======================
   TYPES
====================== */
interface Contact {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contact | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await adminApi.get("/admin/contacts");
        setContacts(res.data.data);
      } catch {
        alert("Failed to load contact messages");
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  return (
    <AdminDashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Contact Messages</h1>
            <p className="text-sm text-muted-foreground">
              Messages submitted from contact page
            </p>
          </div>

          <Badge variant="secondary">
            {contacts.length} Messages
          </Badge>
        </div>

        {/* Loading */}
        {loading && (
          <Card>
            <CardContent className="p-6 space-y-3">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        )}

        {/* Empty */}
        {!loading && contacts.length === 0 && (
          <Card>
            <CardContent className="p-10 text-center text-muted-foreground">
              No messages found
            </CardContent>
          </Card>
        )}

        {/* Desktop Table */}
        {!loading && contacts.length > 0 && (
          <Card className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Received</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {contacts.map((c) => (
                  <TableRow
                    key={c._id}
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => setSelected(c)}
                  >
                    <TableCell className="font-medium">
                      {c.name}
                    </TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>{c.phone || "—"}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {c.message}
                    </TableCell>
                    <TableCell>
                      {new Date(c.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        {/* Mobile Cards */}
        <div className="grid gap-4 md:hidden">
          {contacts.map((c) => (
            <motion.div
              key={c._id}
              whileHover={{ scale: 1.02 }}
            >
              <Card onClick={() => setSelected(c)}>
                <CardHeader>
                  <CardTitle className="text-base">
                    {c.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail size={14} /> {c.email}
                  </div>
                  {c.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={14} /> {c.phone}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    {new Date(c.createdAt).toLocaleDateString()}
                  </div>
                  <p className="line-clamp-2 text-muted-foreground">
                    {c.message}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Message Dialog */}
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare size={18} />
                Message from {selected?.name}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3 text-sm">
              <p>
                <strong>Email:</strong> {selected?.email}
              </p>
              {selected?.phone && (
                <p>
                  <strong>Phone:</strong> {selected.phone}
                </p>
              )}
              <p className="text-muted-foreground whitespace-pre-wrap">
                {selected?.message}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </AdminDashboardLayout>
  );
}
