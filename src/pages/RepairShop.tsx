import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ServiceManager } from '@/components/repair-shop/ServiceManager';
import { TechnicianManager } from '@/components/repair-shop/TechnicianManager';
import { ServiceTracker } from '@/components/repair-shop/ServiceTracker';
import { RepairAnalytics } from '@/components/repair-shop/RepairAnalytics';
import { Wrench, Users, Activity, BarChart3 } from 'lucide-react';

export const RepairShop = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Repair Shop Management</h1>
        <p className="text-muted-foreground">
          Manage services, technicians, and track repair progress for your business
        </p>
      </div>

      <Tabs defaultValue="services" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Services
          </TabsTrigger>
          <TabsTrigger value="technicians" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Technicians
          </TabsTrigger>
          <TabsTrigger value="tracker" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Service Tracker
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          <ServiceManager />
        </TabsContent>

        <TabsContent value="technicians">
          <TechnicianManager />
        </TabsContent>

        <TabsContent value="tracker">
          <ServiceTracker />
        </TabsContent>

        <TabsContent value="analytics">
          <RepairAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};