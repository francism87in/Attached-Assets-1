import { useState, useEffect } from "react";
import { PageWrapper } from "@/components/PageWrapper";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, Lock, Shield, Building2, Mail, Calendar } from "lucide-react";
import { format } from "date-fns";

export function Settings() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();

  const [profile, setProfile] = useState({ name: "", company: "" });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({ name: user.name ?? "", company: user.company ?? "" });
    }
  }, [user]);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!profile.name.trim()) return;
    setIsSavingProfile(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: profile.name.trim(), company: profile.company.trim() || undefined }),
      });
      if (!res.ok) throw new Error(await res.text());
      await refreshUser();
      toast({ title: "Profile updated" });
    } catch {
      toast({ title: "Failed to update profile", variant: "destructive" });
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (passwords.next !== passwords.confirm) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (passwords.next.length < 8) {
      toast({ title: "Password must be at least 8 characters", variant: "destructive" });
      return;
    }
    setIsSavingPassword(true);
    try {
      const res = await fetch("/api/auth/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setPasswords({ current: "", next: "", confirm: "" });
      toast({ title: "Password changed successfully" });
    } catch (err: any) {
      toast({ title: err.message ?? "Failed to change password", variant: "destructive" });
    } finally {
      setIsSavingPassword(false);
    }
  }

  return (
    <PageWrapper>
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-[22px] font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Manage your account and preferences.</p>
      </div>

      {/* Account Info */}
      <Card className="border-border">
        <CardHeader className="pb-3 pt-4 px-4">
          <CardTitle className="text-[11px] uppercase tracking-wider text-muted-foreground font-sans flex items-center gap-2">
            <User className="w-3.5 h-3.5" /> Account Info
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-2.5">
          <div className="flex items-center gap-3 py-1.5">
            <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Email</div>
              <div className="text-sm font-medium">{user?.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 py-1.5">
            <Shield className="w-4 h-4 text-muted-foreground shrink-0" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Role</div>
              <div className="text-sm font-medium capitalize">{user?.role ?? "developer"}</div>
            </div>
          </div>
          {user?.createdAt && (
            <div className="flex items-center gap-3 py-1.5">
              <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Member Since</div>
                <div className="text-sm font-medium">{format(new Date(user.createdAt), "MMMM d, yyyy")}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profile */}
      <Card className="border-border">
        <CardHeader className="pb-3 pt-4 px-4">
          <CardTitle className="text-[11px] uppercase tracking-wider text-muted-foreground font-sans flex items-center gap-2">
            <User className="w-3.5 h-3.5" /> Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-5">
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                placeholder="Your full name"
                className="h-9 text-sm"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="company" className="text-xs">Company / Organisation</Label>
              <Input
                id="company"
                value={profile.company}
                onChange={e => setProfile(p => ({ ...p, company: e.target.value }))}
                placeholder="e.g. Prestige Group"
                className="h-9 text-sm"
              />
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Building2 className="w-3 h-3" />
                Optional — shown on your profile
              </div>
            </div>
            <Button type="submit" size="sm" className="h-8 text-xs" disabled={isSavingProfile}>
              {isSavingProfile ? "Saving…" : "Save Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Password */}
      <Card className="border-border">
        <CardHeader className="pb-3 pt-4 px-4">
          <CardTitle className="text-[11px] uppercase tracking-wider text-muted-foreground font-sans flex items-center gap-2">
            <Lock className="w-3.5 h-3.5" /> Change Password
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-5">
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="current-pw" className="text-xs">Current Password</Label>
              <Input
                id="current-pw"
                type={showPasswords ? "text" : "password"}
                value={passwords.current}
                onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
                placeholder="Your current password"
                className="h-9 text-sm"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-pw" className="text-xs">New Password</Label>
              <Input
                id="new-pw"
                type={showPasswords ? "text" : "password"}
                value={passwords.next}
                onChange={e => setPasswords(p => ({ ...p, next: e.target.value }))}
                placeholder="At least 8 characters"
                className="h-9 text-sm"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm-pw" className="text-xs">Confirm New Password</Label>
              <Input
                id="confirm-pw"
                type={showPasswords ? "text" : "password"}
                value={passwords.confirm}
                onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                placeholder="Repeat new password"
                className="h-9 text-sm"
                required
              />
            </div>
            <div className="flex items-center gap-4">
              <Button type="submit" size="sm" className="h-8 text-xs" disabled={isSavingPassword}>
                {isSavingPassword ? "Changing…" : "Change Password"}
              </Button>
              <button
                type="button"
                onClick={() => setShowPasswords(v => !v)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPasswords ? "Hide" : "Show"} passwords
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/30">
        <CardHeader className="pb-3 pt-4 px-4">
          <CardTitle className="text-[11px] uppercase tracking-wider text-destructive/70 font-sans">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-medium">Delete Account</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Permanently delete your account and all projects. This cannot be undone.
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="h-8 text-xs shrink-0"
              onClick={() => toast({ title: "Contact support to delete your account", variant: "destructive" })}
            >
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
    </PageWrapper>
  );
}
