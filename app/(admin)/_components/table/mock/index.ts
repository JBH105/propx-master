// import { faker } from '@faker-js/faker';
import { holdingItemSchemaType } from '../schema/holdings-table.schema';

export const generateFakeHoldings = async (count: number = 10): Promise<holdingItemSchemaType[]> => {
    return Array.from({ length: count }, () => ({
        offerings: {
            name: "Skyline Luxury Residence",
            invested: "300",
        },
        investmentType: "IG",
        unitsHolding: "30",
        propUnits: "25000",
        dividends: "0",
        totalpl: "0",
    }));
};

