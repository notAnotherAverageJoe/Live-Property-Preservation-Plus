# Project Proposal

1. What tech stack will you use for your final project? ->>

   I will be using Node, React, Exptress, and PostgresQL

2. Is the front-end UI or the back-end going to be the focus of your project? Or are
   you going to make an evenly focused full-stack application? ->>

   This will be a evenly focused project, I want the UI to be clear, clear and consicse in order to help users have a smooth experience. In order to do this I will leverage some heavy lifting backend.

3. Will this be a website? A mobile app? Something else? ->>

   It will be a web based platform for property management.

4. What goal will your project be designed to achieve? ->>

   To simplify the paper trail required for good management of proprties.
   The main goal is to allow one spot, one platform that offers deep insight into
   the health and well being of a property, its maintence requirements and the
   revenue after that maintence. This would allow companies to focus on what needs to be done and not let small needs slip through the cracks until they become large repairs. For example if the property managers keep overlooking empty apartments that had the A/C turned off especialliy in hot humid weather like florida, mold will grow and become a serious problem. This would be a piece of information my system will ensure does not go unnoticed.

5. What kind of users will visit your app? In other words, what is the demographic of
   your users? ->>

   This is a business based and focused application, I want companies like bozzuto and livcor to use this system. The aim is to simplifiy vital information for each property allowing more structure for proper maintenance and focusing on prevention and preservation.

6. What data do you plan on using? How are you planning on collecting your data?
   Maintenance Planning: ->>
   I will use a weather api:
   have yet to narrow down to one, but likely will be OpenweatherMap or weatherApi since I have worked with both.

   ## WeatherAPI

   ## OpenWeatherMap API

   ## AccuWeather API

   ## Climacell (Tomorrow.io) API

   ## Weatherbit API

   Weather data can help property managers schedule maintenance tasks. For example, outdoor repairs like roofing or landscaping should be planned around favorable weather conditions. It can also
   alert tenants and maintenance staff in advance about potential disruptions due to severe weather.

7. What kinds of issues might you run into with your API?

   Working with latitude and longitude could be a potential issue, since this is not something people often work with. Also the limitations the API's place on how are out one can look with a free version of it maybe lead to some shortcomings. I will research each of the options to see which offers the most vital weather information.

Here's the revised version of section 8:

8. What functionality will your app include?

The app will include a robust set of functionalities designed to streamline property management:

Property Management: The system will allow users to add and manage properties, including details about each unit, tenant information, and maintenance history. Users can track occupancy, monitor maintenance needs, and manage financials to ensure each property is operating at peak profitability.

Maintenance Requests and Fulfillment: Users will be able to create, view, and update maintenance requests. The system will ensure that maintenance tasks are completed in a timely manner and will allow property managers to schedule tasks based on favorable weather conditions, helping to prevent costly repairs.

Customizable User Roles and Permissions: The platform will be fully customizable. Property owners and managers can create accounts and manage users with various roles, such as admin, maintenance staff, or tenant. This flexibility allows for tailored access and control, ensuring that each user only interacts with the features relevant to their role.

Tenant Management: The app will include functionality for managing tenants, allowing property managers to add new tenants, update tenant information, track rent payments, and address tenant issues.

Profitability Analysis: The system will use data from properties, units, tenants, and maintenance requests to provide insights into the overall profitability of each property. This will help managers make informed decisions about rent pricing, maintenance budgets, and occupancy strategies.

Preventative Maintenance Focus: By tracking maintenance data and offering insights into potential future issues, the system will help property managers focus on preventative care. This will reduce the likelihood of small issues escalating into major repairs, saving time and money.

Analytics and Reporting: Users will have access to detailed analytics and reports, offering insights into occupancy rates, maintenance trends, financial performance, and more. These reports will help property managers make data-driven decisions to optimize their operations.

The customizable nature of the system ensures that it can be tailored to meet the specific needs of any property owner or manager, making it a powerful tool for maintaining and improving property performance.

9. What will the user flow look like?

The user flow will begin with a login or registration screen for property managers and maintenance staff. After logging in, users will be taken to a dashboard that displays a summary of all properties they manage.

- Dashboard: Users can view high-level insights into property health, including occupancy rates, maintenance schedules, and recent maintenance requests.

- Property Management: Users can select a specific property to view detailed information, including unit availability, tenant information, and maintenance history.

- Maintenance Requests: Users can create, view, and update maintenance requests. This section will also allow users to schedule maintenance based on weather data, ensuring optimal timing for outdoor repairs.

- Tenant Management: Users can add new tenants, update tenant information, and view tenant history, including rent payments and any reported issues.

- Analytics: Users will have access to detailed analytics showing profitability, maintenance costs, and trends over time. This data can be used to make informed decisions on property management.

- Alerts and Notifications: Users can set up alerts for critical maintenance issues, receive weather-related warnings, and send notifications to tenants.

- Logout: Users can log out from any page, ensuring secure access to the system.

10. What features make your site more than a CRUD app? What are your stretch
    goals?

- Weather Integration: The app will integrate with a weather API to help property managers schedule maintenance tasks around favorable weather conditions, reducing the risk of damage due to inclement weather.

- Preventative Maintenance Tracking: The app will monitor the health of properties by analyzing maintenance data and alerting users to potential issues before they become costly repairs. This includes tracking trends in maintenance requests and suggesting proactive measures.

- Profitability Insights: The app will offer detailed financial insights, allowing users to track the profitability of each property by analyzing revenue against maintenance costs and other expenses.

- Advanced Analytics and Reporting: Users will have access to comprehensive reports and analytics that provide a deeper understanding of property performance over time. This includes visualizations of occupancy rates, maintenance trends, and financial performance.

## Stretch Goals

Emergency Alerts: A stretch goal for the app is to implement an emergency notification system that can send SMS or email alerts to tenants and staff in the event of severe weather or other emergencies. This system would ensure that everyone is informed and can take appropriate action to protect themselves and the property.

Customizable Maintenance Workflows: Allow property managers to create and customize maintenance workflows tailored to their specific needs. This could include automated task assignments, priority setting, and progress tracking.

Energy Efficiency Tracking: Monitor and report on the energy efficiency of each property, providing insights into utility usage and suggesting ways to reduce energy costs. This could also include integration with energy-saving devices.
