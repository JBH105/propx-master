type Investor = {
    id: number
    name: string
    email: string
    date: string
    investment: string
    units: number
  }
  
 export const allInvestors: Investor[] = [
    {
      id: 1,
      name: "Ann Lubin",
      email: "example@mail.com",
      date: "2024/01/03",
      investment: "CA$10,000",
      units: 1000,
    },
    {
      id: 2,
      name: "Mira Dokidis",
      email: "example@mail.com",
      date: "2024/01/03",
      investment: "CA$5,000",
      units: 500,
    },
    {
      id: 3,
      name: "Haylie Bergson",
      email: "example@mail.com",
      date: "2024/01/03",
      investment: "CA$7,500",
      units: 750,
    },
    {
      id: 4,
      name: "Skylar Geidt",
      email: "example@mail.com",
      date: "2024/01/03",
      investment: "CA$1,200",
      units: 120,
    },
    {
      id: 5,
      name: "Zaire Calzoni",
      email: "example@mail.com",
      date: "2024/01/03",
      investment: "CA$500",
      units: 50,
    },
    // Add more data for pagination
    ...Array.from({ length: 30 }).map((_, i) => ({
      id: i + 6,
      name: `Investor ${i + 6}`,
      email: "example@mail.com",
      date: "2024/01/03",
      investment: `CA$${Math.floor(Math.random() * 10000)}`,
      units: Math.floor(Math.random() * 1000),
    })),
  ]