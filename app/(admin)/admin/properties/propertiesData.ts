import property1 from "../../../../assets/images/property1.png";
import property2 from "../../../../assets/images/property2.png";
import property3 from "../../../../assets/images/property3.png";
import property4 from "../../../../assets/images/property4.png";
import property5 from "../../../../assets/images/property5.png";
import blog1 from "../../../../assets/images/blog1.png";
import blog2 from "../../../../assets/images/blog2.png";
import blog3 from "../../../../assets/images/blog3.png";
import blog4 from "../../../../assets/images/blog4.png";
import blog5 from "../../../../assets/images/blog5.png";

export const propertiesData = {
    metrics: [
      {
        title: "TOTAL INVESTMENTS RAISED",
        value: "CA$35K",
        showValueGreen: true,
        change: "3.95%",
        isProfit: true,
        period: "Last Updated 1 day ago",
        timePeriod: "This Month",
        isPositive: true,
      },
      {
        title: "TOTAL INVESTORS",
        value: "20",
        change: "1.27%",
        period: "11 Mar, 2025",
        timePeriod: "This Month",
        isPositive: true,
      },
      {
        title: "ACTIVE PROPERTIES",
        value: "4",
        period: "Last Updated 2 days ago",
        isPositive: true,
      },
      {
        title: "AVG. INVESTMENT PER INVESTOR",
        value: "CA$700.00",
        change: "1.27%",
        period: "Last Updated 2 days ago",
        timePeriod: "This Month",
        isPositive: true,
      },
      {
        title: "TOP PROEPRTY MANAGEMEMT",
        value: "Metro Manaor Villa",
        period: "11 Mar, 2025",
        noOfInvestors: "5,000"
      },
    ],
    listedProperties: [
      {
        id: 1,
        offering: "Terrace Heights",
        location: "Toronto, ON",
        totalInvestment: 'CA$10,000',
        ppu: "CA$15.00",
        dayLeftToClose: "15",
        fundRaised: 75,
        totalInvestors: 235,
        image: property1,
      },
      {
        id: 2,
        offering: "Metro Manor Villas",
        location: "Vancouver, BC",
        ppu: "CA$15.00",
        totalInvestment: 'CA$25,000',
        dayLeftToClose: "1",
        fundRaised: 50,
        totalInvestors: 477,
        image: property2,
      },
      {
        id: 3,
        offering: "Sunflower Fields",
        location: "Edmonton, AB",
        ppu: "CA$15.00",
        dayLeftToClose: "15",
        totalInvestment: 'CA$7,500',
        fundRaised: 37,
        totalInvestors: 563,
        image: property3,
      },
      {
        id: 4,
        offering: "Sunrise Apartments",
        location: "Manitoba, MB",
        ppu: "CA$15.00",
        dayLeftToClose: "7",
        fundRaised: 100,
        totalInvestment: 'CA$8100',
        totalInvestors: 831,
        fullyFunded: true,
        image: property4,
      },
      {
        id: 5,
        offering: "Midtown Strip Mall",
        location: "Quebec, QC",
        ppu: "CA$15.00",
        totalInvestment: 'CA$1500',
        dayLeftToClose: "10",
        fundRaised: 15,
        totalInvestors: 153,
        image: property5,
      },
    ],
    listedBlogs: [
      {
        id: 1,
        title: "The Dos and Don'ts of Real Estate Investing",
        publishedDate: "2024/01/03 at 11:30 am",
        engagement: 230,
        image: blog1,
      },
      {
        id: 2,
        title: "How Fractional Ownership Can Transform Your Real Estate...",
        publishedDate: "2024/01/03 at 11:30 am",
        engagement: 477,
        image: blog2,
      },
      {
        id: 3,
        title: "The Dos and Don'ts of Real Estate Investing",
        publishedDate: "2024/01/03 at 11:30 am",
        engagement: 563,
        image: blog3,
      },
      {
        id: 4,
        title: "Understanding the Real Estate Market: A Beginner's Guide",
        publishedDate: "2024/01/03 at 11:30 am",
        engagement: 831,
        image: blog4,
      },
      {
        id: 5,
        title: "Key Strategies for Success in Real Estate",
        publishedDate: "2024/01/03 at 11:30 am",
        engagement: 153,
        image: blog5,
      },
    ],
    loginActivity: [
      {
        id: 1,
        userName: "Ann Loken",
        contactDetails: {
          email: "example@email.com",
          phone: "+1 857 352 2359",
        },
        loginDateTime: "2024/01/03 at 11:30 am",
        deviceType: "Mobile",
        ipAddress: "192.38.85.0/0",
        location: "Toronto, ON",
        status: "Active",
      },
      {
        id: 2,
        userName: "Mike Okafor",
        contactDetails: {
          email: "example@email.com",
          phone: "+1 857 352 2359",
        },
        loginDateTime: "2024/01/03 at 11:30 am",
        deviceType: "Desktop",
        ipAddress: "192.38.85.0/0",
        location: "Edmonton, AB",
        status: "Active",
      },
      {
        id: 3,
        userName: "Hayfa Bergson",
        contactDetails: {
          email: "example@email.com",
          phone: "+1 857 352 2359",
        },
        loginDateTime: "2024/01/03 at 11:30 am",
        deviceType: "Mobile",
        ipAddress: "192.38.85.0/0",
        location: "Vancouver, BC",
        status: "Idle",
      },
      {
        id: 4,
        userName: "Skylar Doshi",
        contactDetails: {
          email: "example@email.com",
          phone: "+1 857 352 2359",
        },
        loginDateTime: "2024/01/03 at 11:30 am",
        deviceType: "Tablet",
        ipAddress: "192.38.85.0/0",
        location: "Vancouver, BC",
        status: "Logged Out",
      },
      {
        id: 5,
        userName: "Zaire Calzoni",
        contactDetails: {
          email: "example@email.com",
          phone: "+1 857 352 2359",
        },
        loginDateTime: "2024/01/03 at 11:30 am",
        deviceType: "Mobile",
        ipAddress: "192.38.85.0/0",
        location: "Vancouver, BC",
        status: "Logged Out",
      },
    ],
  };
