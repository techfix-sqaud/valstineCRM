
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Activity = {
  id: number;
  user: {
    name: string;
    avatar?: string;
    initials: string;
  };
  action: string;
  time: string;
};

interface RecentActivitiesProps {
  activities: Activity[];
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-4">
            <Avatar className="h-9 w-9">
              <AvatarImage src={activity.user.avatar} />
              <AvatarFallback>{activity.user.initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm">
                <span className="font-medium">{activity.user.name}</span>{" "}
                {activity.action}
              </p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
