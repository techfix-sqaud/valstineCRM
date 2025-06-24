import { useState } from "react";
import Layout from "@/components/layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PaymentMethodEdit } from "@/components/billing/PaymentMethodEdit";

const Billing = () => {
  const { toast } = useToast();
  const [currentPlan, setCurrentPlan] = useState("starter");
  const [isPaymentEditOpen, setIsPaymentEditOpen] = useState(false);

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "$19",
      period: "per month",
      features: [
        "Up to 50 clients",
        "Up to 100 invoices",
        "Basic reporting",
        "1 user account",
        "Email support",
      ],
    },
    {
      id: "professional",
      name: "Professional",
      price: "$49",
      period: "per month",
      features: [
        "Up to 500 clients",
        "Unlimited invoices",
        "Advanced reporting",
        "5 user accounts",
        "Email and phone support",
        "Client portal",
        "Basic automation",
      ],
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$99",
      period: "per month",
      features: [
        "Unlimited clients",
        "Unlimited invoices",
        "Custom reporting",
        "Unlimited user accounts",
        "Priority support",
        "Client portal",
        "Advanced automation",
        "API access",
        "Custom integrations",
      ],
    },
  ];

  const handleUpgrade = (planId: string) => {
    toast({
      title: "Plan upgraded",
      description: `You are now subscribed to the ${planId.charAt(0).toUpperCase() + planId.slice(1)} plan.`,
    });
    setCurrentPlan(planId);
  };

  const invoices = [
    {
      id: "INV-SUB-001",
      date: "May 1, 2023",
      amount: "$19.00",
      status: "paid",
    },
    {
      id: "INV-SUB-002",
      date: "April 1, 2023",
      amount: "$19.00",
      status: "paid",
    },
    {
      id: "INV-SUB-003",
      date: "March 1, 2023",
      amount: "$19.00",
      status: "paid",
    },
  ];

  return (
    <Layout
      header={
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Billing & Subscription</h1>
        </div>
      }
    >
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>
              Your subscription and billing information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium capitalize">{currentPlan} Plan</h3>
                <p className="text-sm text-muted-foreground">
                  Next billing date: June 1, 2023
                </p>
              </div>
              <Badge variant="outline" className="capitalize">
                Active
              </Badge>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsPaymentEditOpen(true)}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Update Payment Method
            </Button>
          </CardFooter>
        </Card>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={
                plan.popular
                  ? "border-primary"
                  : "border"
              }
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.popular && (
                    <Badge className="bg-primary">Popular</Badge>
                  )}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">
                    {plan.period}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {currentPlan === plan.id ? (
                  <Button className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handleUpgrade(plan.id)}
                  >
                    {currentPlan === "starter" && plan.id !== "starter"
                      ? "Upgrade"
                      : currentPlan === "professional" && plan.id === "enterprise"
                      ? "Upgrade"
                      : "Switch Plan"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>
              Your recent subscription invoices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50 text-sm">
                    <th className="p-3 text-left font-medium">Invoice</th>
                    <th className="p-3 text-left font-medium">Date</th>
                    <th className="p-3 text-left font-medium">Amount</th>
                    <th className="p-3 text-left font-medium">Status</th>
                    <th className="p-3 text-right font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b">
                      <td className="p-3 text-sm">{invoice.id}</td>
                      <td className="p-3 text-sm">{invoice.date}</td>
                      <td className="p-3 text-sm">{invoice.amount}</td>
                      <td className="p-3 text-sm">
                        <Badge
                          variant="outline"
                          className="capitalize border-green-500 bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400"
                        >
                          {invoice.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-right text-sm">
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <PaymentMethodEdit
        isOpen={isPaymentEditOpen}
        onClose={() => setIsPaymentEditOpen(false)}
      />
    </Layout>
  );
};

export default Billing;
