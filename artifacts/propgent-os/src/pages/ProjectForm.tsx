import { useEffect } from "react";
import { PageWrapper } from "@/components/PageWrapper";
import { useLocation, useParams } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useCreateProject,
  useGetProject,
  useUpdateProject,
  getListProjectsQueryKey,
  getGetProjectQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, X } from "lucide-react";
import { Link } from "wouter";

const UNIT_TYPE_OPTIONS = ["Studio", "1BHK", "2BHK", "3BHK", "4BHK", "Penthouse", "Villa", "Plot"];
const AMENITY_OPTIONS = [
  "Swimming Pool", "Gym", "Clubhouse", "Security", "Parking", "Garden",
  "Children's Play Area", "Lift", "Power Backup", "Intercom", "Jogging Track",
  "Sports Court", "Yoga Room", "Spa", "Rooftop Terrace", "Co-working Space"
];

const formSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  developerName: z.string().min(1, "Developer name is required"),
  location: z.string().min(1, "Location is required"),
  city: z.string().optional(),
  state: z.string().optional(),
  priceMin: z.string().optional(),
  priceMax: z.string().optional(),
  carpetAreaMin: z.string().optional(),
  carpetAreaMax: z.string().optional(),
  possessionDate: z.string().optional(),
  unitTypes: z.array(z.string()).default([]),
  amenities: z.array(z.string()).default([]),
  trustScore: z.number().min(0).max(100).default(50),
  locationScore: z.number().min(0).max(100).default(50),
  status: z.enum(["draft", "active", "archived"]).default("draft"),
});

type FormValues = z.infer<typeof formSchema>;

interface ProjectFormProps {
  mode: "create" | "edit";
}

export function ProjectForm({ mode }: ProjectFormProps) {
  const params = useParams();
  const projectId = params.id ? parseInt(params.id) : undefined;
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: project, isLoading: isLoadingProject } = useGetProject(
    projectId!,
    { query: { enabled: mode === "edit" && !!projectId, queryKey: getGetProjectQueryKey(projectId!) } }
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      developerName: "",
      location: "",
      city: "",
      state: "",
      priceMin: "",
      priceMax: "",
      carpetAreaMin: "",
      carpetAreaMax: "",
      possessionDate: "",
      unitTypes: [],
      amenities: [],
      trustScore: 50,
      locationScore: 50,
      status: "draft",
    },
  });

  useEffect(() => {
    if (project && mode === "edit") {
      form.reset({
        name: project.name,
        developerName: project.developerName,
        location: project.location,
        city: project.city ?? "",
        state: project.state ?? "",
        priceMin: project.priceMin?.toString() ?? "",
        priceMax: project.priceMax?.toString() ?? "",
        carpetAreaMin: project.carpetAreaMin?.toString() ?? "",
        carpetAreaMax: project.carpetAreaMax?.toString() ?? "",
        possessionDate: project.possessionDate ?? "",
        unitTypes: (project.unitTypes ?? []).map((u: any) => u.type),
        amenities: project.amenities ?? [],
        trustScore: project.trustScore ?? 50,
        locationScore: project.locationScore ?? 50,
        status: project.status ?? "draft",
      });
    }
  }, [project, mode, form]);

  const createProject = useCreateProject({
    mutation: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
        toast({ title: "Project created successfully" });
        setLocation(`/projects/${data.id}`);
      },
      onError: () => toast({ title: "Failed to create project", variant: "destructive" }),
    },
  });

  const updateProject = useUpdateProject({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetProjectQueryKey(projectId!) });
        toast({ title: "Project updated" });
        setLocation(`/projects/${projectId}`);
      },
      onError: () => toast({ title: "Failed to update project", variant: "destructive" }),
    },
  });

  function onSubmit(values: FormValues) {
    const unitTypes = values.unitTypes.map((type) => ({ type }));
    const payload = {
      name: values.name,
      developerName: values.developerName,
      location: values.location,
      city: values.city || undefined,
      state: values.state || undefined,
      priceMin: values.priceMin ? parseFloat(values.priceMin) : undefined,
      priceMax: values.priceMax ? parseFloat(values.priceMax) : undefined,
      carpetAreaMin: values.carpetAreaMin ? parseFloat(values.carpetAreaMin) : undefined,
      carpetAreaMax: values.carpetAreaMax ? parseFloat(values.carpetAreaMax) : undefined,
      possessionDate: values.possessionDate || undefined,
      unitTypes,
      amenities: values.amenities,
      trustScore: values.trustScore,
      locationScore: values.locationScore,
    };

    if (mode === "create") {
      createProject.mutate({ data: payload });
    } else {
      updateProject.mutate({ id: projectId!, data: { ...payload, status: values.status } });
    }
  }

  if (mode === "edit" && isLoadingProject) {
    return (
      <div className="space-y-6 max-w-3xl">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-4">
          {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      </div>
    );
  }

  const isPending = createProject.isPending || updateProject.isPending;

  return (
    <PageWrapper>
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href={mode === "edit" ? `/projects/${projectId}` : "/projects"}>
          <Button variant="ghost" size="icon" className="w-8 h-8" data-testid="button-back">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-serif tracking-tight">
            {mode === "create" ? "New Project" : "Edit Project"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {mode === "create" ? "Add a real estate project to PropAgent OS." : "Update project details."}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          {/* Basic Info */}
          <Card className="border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-sans uppercase tracking-wider text-muted-foreground">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name *</FormLabel>
                    <FormControl>
                      <Input data-testid="input-name" placeholder="e.g. Prestige Lakeside Habitat" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="developerName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Developer Name *</FormLabel>
                    <FormControl>
                      <Input data-testid="input-developer" placeholder="e.g. Prestige Group" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="location" render={({ field }) => (
                <FormItem>
                  <FormLabel>Location / Area *</FormLabel>
                  <FormControl>
                    <Input data-testid="input-location" placeholder="e.g. Whitefield, Varthur Road" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="city" render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input data-testid="input-city" placeholder="e.g. Bengaluru" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="state" render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input data-testid="input-state" placeholder="e.g. Karnataka" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Area */}
          <Card className="border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-sans uppercase tracking-wider text-muted-foreground">Pricing & Area</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="priceMin" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Min (₹)</FormLabel>
                    <FormControl>
                      <Input data-testid="input-price-min" type="number" placeholder="e.g. 8500000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="priceMax" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Max (₹)</FormLabel>
                    <FormControl>
                      <Input data-testid="input-price-max" type="number" placeholder="e.g. 15000000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="carpetAreaMin" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carpet Area Min (sq ft)</FormLabel>
                    <FormControl>
                      <Input data-testid="input-area-min" type="number" placeholder="e.g. 950" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="carpetAreaMax" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carpet Area Max (sq ft)</FormLabel>
                    <FormControl>
                      <Input data-testid="input-area-max" type="number" placeholder="e.g. 1650" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="possessionDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>Possession Date</FormLabel>
                  <FormControl>
                    <Input data-testid="input-possession" placeholder="e.g. Dec 2026" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </CardContent>
          </Card>

          {/* Unit Types */}
          <Card className="border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-sans uppercase tracking-wider text-muted-foreground">Unit Types</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField control={form.control} name="unitTypes" render={({ field }) => (
                <FormItem>
                  <div className="flex flex-wrap gap-2">
                    {UNIT_TYPE_OPTIONS.map((type) => (
                      <button
                        key={type}
                        type="button"
                        data-testid={`button-unit-${type}`}
                        onClick={() => {
                          const current = field.value ?? [];
                          if (current.includes(type)) {
                            field.onChange(current.filter((t) => t !== type));
                          } else {
                            field.onChange([...current, type]);
                          }
                        }}
                        className={`px-3 py-1.5 text-sm rounded border transition-colors ${
                          (field.value ?? []).includes(type)
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )} />
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card className="border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-sans uppercase tracking-wider text-muted-foreground">Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField control={form.control} name="amenities" render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {AMENITY_OPTIONS.map((amenity) => (
                      <label key={amenity} className="flex items-center gap-2 cursor-pointer" data-testid={`checkbox-amenity-${amenity.replace(/\s/g, "-")}`}>
                        <Checkbox
                          checked={(field.value ?? []).includes(amenity)}
                          onCheckedChange={(checked) => {
                            const current = field.value ?? [];
                            if (checked) {
                              field.onChange([...current, amenity]);
                            } else {
                              field.onChange(current.filter((a) => a !== amenity));
                            }
                          }}
                        />
                        <span className="text-sm">{amenity}</span>
                      </label>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )} />
            </CardContent>
          </Card>

          {/* Scores */}
          <Card className="border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-sans uppercase tracking-wider text-muted-foreground">Manual Scores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField control={form.control} name="locationScore" render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between mb-2">
                    <FormLabel>Location Score</FormLabel>
                    <span className="font-mono text-sm font-medium text-primary" data-testid="text-location-score">{field.value}/100</span>
                  </div>
                  <FormControl>
                    <Slider
                      data-testid="slider-location-score"
                      min={0} max={100} step={5}
                      value={[field.value]}
                      onValueChange={([val]) => field.onChange(val)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="trustScore" render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between mb-2">
                    <FormLabel>Trust Score (Developer Reputation)</FormLabel>
                    <span className="font-mono text-sm font-medium text-primary" data-testid="text-trust-score">{field.value}/100</span>
                  </div>
                  <FormControl>
                    <Slider
                      data-testid="slider-trust-score"
                      min={0} max={100} step={5}
                      value={[field.value]}
                      onValueChange={([val]) => field.onChange(val)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </CardContent>
          </Card>

          {/* Status (edit only) */}
          {mode === "edit" && (
            <Card className="border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-sans uppercase tracking-wider text-muted-foreground">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger data-testid="select-status">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
            </Card>
          )}

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={isPending} data-testid="button-submit" className="min-w-[140px]">
              {isPending ? "Saving..." : mode === "create" ? "Generate AI Listing" : "Save Changes"}
            </Button>
            <Link href={mode === "edit" ? `/projects/${projectId}` : "/projects"}>
              <Button type="button" variant="outline" data-testid="button-cancel">Cancel</Button>
            </Link>
          </div>
        </form>
      </Form>
    </div>
    </PageWrapper>
  );
}
