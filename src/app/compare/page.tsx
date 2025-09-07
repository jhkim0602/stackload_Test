"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TECHS } from "@/lib/data";

type Feature = {
  key: string;
  title: string;
};

type TechSummary = {
  name: string;
  version: string;
  license: string;
  pros: string[];
  cons: string[];
};

const FEATURES: Feature[] = [
  { key: "community", title: "커뮤니티 규모" },
  { key: "performance", title: "성능/효율" },
  { key: "learning", title: "학습 난이도" },
  { key: "ecosystem", title: "생태계/플러그인" },
];

const PRESETS: Record<string, TechSummary> = Object.fromEntries(
  TECHS.map((t) => [
    t.slug,
    {
      name: t.name,
      version: t.version ?? "",
      license: t.license ?? "",
      pros: [],
      cons: [],
    },
  ])
);

export default function ComparePage() {
  const [left, setLeft] = useState<keyof typeof PRESETS>("nextjs");
  const [right, setRight] = useState<keyof typeof PRESETS>("react");

  const leftData = PRESETS[left];
  const rightData = PRESETS[right];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {leftData.name}
              <Select value={left} onValueChange={(v) => setLeft(v as keyof typeof PRESETS)}>
                <SelectTrigger className="w-40"><SelectValue placeholder="기술 선택" /></SelectTrigger>
                <SelectContent>
                  {Object.keys(PRESETS).map((k) => (
                    <SelectItem key={k} value={k}>{PRESETS[k as keyof typeof PRESETS].name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary">v{leftData.version}</Badge>
              <Badge variant="outline">{leftData.license}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium">장점</p>
              <ul className="list-disc pl-4 text-sm text-muted-foreground">
                {leftData.pros.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium">단점</p>
              <ul className="list-disc pl-4 text-sm text-muted-foreground">
                {leftData.cons.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {rightData.name}
              <Select value={right} onValueChange={(v) => setRight(v as keyof typeof PRESETS)}>
                <SelectTrigger className="w-40"><SelectValue placeholder="기술 선택" /></SelectTrigger>
                <SelectContent>
                  {Object.keys(PRESETS).map((k) => (
                    <SelectItem key={k} value={k}>{PRESETS[k as keyof typeof PRESETS].name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary">v{rightData.version}</Badge>
              <Badge variant="outline">{rightData.license}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium">장점</p>
              <ul className="list-disc pl-4 text-sm text-muted-foreground">
                {rightData.pros.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium">단점</p>
              <ul className="list-disc pl-4 text-sm text-muted-foreground">
                {rightData.cons.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>기능 비교</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>항목</TableHead>
                <TableHead>{leftData.name}</TableHead>
                <TableHead>{rightData.name}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {FEATURES.map((f) => (
                <TableRow key={f.key}>
                  <TableCell>{f.title}</TableCell>
                  <TableCell>—</TableCell>
                  <TableCell>—</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}


