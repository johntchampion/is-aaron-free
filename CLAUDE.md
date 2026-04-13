# Is Aaron Free - React App

This simple web application is meant to easily find out whether or not Aaron is free.

Aaron's working schedule is a little complicated, but it can be determined with a little calendar math.

## Aaron's work schedule

Aaron works a different schedule every week. It looks like this, and the schedule repeats indefinitely.

| Sunday  | Monday  | Tuesday | Wednesday | Thursday | Friday  | Saturday |
| ------- | ------- | ------- | --------- | -------- | ------- | -------- |
| Free    | Working | Working | Free      | Free     | Working | Working  |
| Working | Free    | Free    | Working   | Working  | Free    | Free     |

You can figure out when he is working by using the last known day of the week he was free or working,
and then you can use math to count forward to the day you want to know if Aaron is free.

## Requirements

1. The user must be able to pick a date on a calendar and see immediately whether Aaron works that day.
2. Immediatley upon loading the page, it must be displayed whether Aaron is working today, and it should show is work schedule for this week and next week.
3. The application should be optimized for mobile devices.
4. The application should support light and dark mode, but that should only be styled using CSS media queries. There should be no toggle or override of the system preference in the app; use only CSS media queries to style the app light or dark.
