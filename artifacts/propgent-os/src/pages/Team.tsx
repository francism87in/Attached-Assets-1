import { useState } from "react";
import { PageWrapper } from "@/components/PageWrapper";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Users, Mail, Shield, Crown, Eye, UserPlus, Building2, Clock } from "lucide-react";
import { format } from "date-fns";

const ROLES = [
  {
    name: "Admin",
    icon: Crown,
    color: "text-yellow-600",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    description: "Full access to all projects, settings, and team management.",
  },
  {
    name: "Developer",
    icon: Building2,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    description: "Can create and manage projects, generate AI summaries, use the API Console.",
  },
  {
    name: "Viewer",
    icon: Eye,
    color: "text-slate-500",
    bg: "bg-slate-500/10",
    border: "border-slate-500/20",
    description: "Read-only access to projects and AI reports. Cannot create or edit.",
  },
];

export function Team() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"developer" | "viewer">("developer");
  const [isSending, setIsSending] = useState(false);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setIsSending(true);
    await new Promise(r => setTimeout(r, 900));
    setIsSending(false);
    setInviteEmail("");
    toast({
      title: "Invite sent",
      description: `An invitation has been sent to ${inviteEmail}. (Team invites coming in the next release.)`,
    });
  }

  const roleInfo = ROLES.find(r => r.name.toLowerCase() === (user?.role ?? "developer")) ?? ROLES[1];
  const RoleIcon = roleInfo.icon;

  return (
    <PageWrapper>
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-[22px] font-bold tracking-tight">Team</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Manage your workspace members and roles.</p>
      </div>

      {/* Current Members */}
      <Card className="border-border overflow-hidden">
        <CardHeader className="pb-3 pt-4 px-4 flex flex-row items-center justify-between">
          <CardTitle className="text-[11px] uppercase tracking-wider text-muted-foreground font-sans">Members</CardTitle>
          <Badge variant="outline" className="text-[10px]">1 member</Badge>
        </CardHeader>
        <div className="divide-y divide-border">
          {/* Current user */}
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-primary text-[13px] font-bold shrink-0">
                {user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() ?? "U"}
              </div>
              <div>
                <div className="text-[13px] font-medium leading-none">{user?.name}</div>
                <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1.5">
                  <Mail className="w-3 h-3" />
                  {user?.email}
                </div>
                {user?.company && (
                  <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1.5">
                    <Building2 className="w-3 h-3" />
                    {user.company}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {user?.createdAt && (
                <div className="text-[10px] text-muted-foreground hidden sm:flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Joined {format(new Date(user.createdAt), "MMM yyyy")}
                </div>
              )}
              <Badge className={`text-[10px] capitalize ${roleInfo.bg} ${roleInfo.color} ${roleInfo.border} border`} variant="outline">
                <RoleIcon className="w-3 h-3 mr-1" />
                {user?.role ?? "developer"}
              </Badge>
              <Badge variant="outline" className="text-[9px] border-primary/20 text-primary">You</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Invite Section */}
      <Card className="border-border">
        <CardHeader className="pb-3 pt-4 px-4">
          <CardTitle className="text-[11px] uppercase tracking-wider text-muted-foreground font-sans">Invite a Team Member</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-5">
          <form onSubmit={handleInvite} className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                className="flex-1 h-9 text-sm"
                required
              />
              <select
                value={inviteRole}
                onChange={e => setInviteRole(e.target.value as "developer" | "viewer")}
                className="h-9 px-3 rounded-md border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="developer">Developer</option>
                <option value="viewer">Viewer</option>
              </select>
              <Button type="submit" className="h-9 gap-2 text-sm" disabled={isSending}>
                <UserPlus className="w-3.5 h-3.5" />
                {isSending ? "Sending…" : "Invite"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              They'll receive an email to join your workspace. Multi-user collaboration is available in the Team plan.
            </p>
          </form>
        </CardContent>
      </Card>

      {/* Roles Reference */}
      <Card className="border-border">
        <CardHeader className="pb-3 pt-4 px-4">
          <CardTitle className="text-[11px] uppercase tracking-wider text-muted-foreground font-sans">Role Permissions</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-3">
          {ROLES.map(role => {
            const Icon = role.icon;
            return (
              <div key={role.name} className={`flex items-start gap-3 p-3 rounded-lg border ${role.border} ${role.bg}`}>
                <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${role.bg}`}>
                  <Icon className={`w-4 h-4 ${role.color}`} />
                </div>
                <div>
                  <div className={`text-[13px] font-semibold ${role.color}`}>{role.name}</div>
                  <div className="text-[12px] text-muted-foreground mt-0.5">{role.description}</div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Upgrade CTA */}
      <Card className="border-border bg-muted/20">
        <CardContent className="p-4 flex items-start gap-3">
          <Users className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-medium">Multi-user workspaces — Coming in Team Plan</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Invite unlimited colleagues, manage permissions, and collaborate on projects in real time.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </PageWrapper>
  );
}
