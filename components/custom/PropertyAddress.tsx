"use client";

import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import api from "@/config/api";

type PropertyAddressProps = {
  form: any;
};

const PropertyAddress = ({ form }: PropertyAddressProps) => {
  const fetchPostalCodeData = async (value: string) => {
    try {
      const response = await api.get(`/properties/pincode/${value}`);
      const { city, province } = response?.data?.details?.data;
      form.setValue("city", city.toLowerCase());
      form.setValue("province", province.toLowerCase());
      form.clearErrors("postalCode");
    } catch (error) {
      form.setError("postalCode", {
        type: "manual",
        message: "Invalid postal code, please enter valid postal code",
      });
    }
  };

  return (
    <>
      <div className="mt-6">
        <h3 className="text-sm text-[#9A9A9A] mb-4">Physical Address</h3>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormControl>
                <Input
                  placeholder="Suit, Apartment, Street Address"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Postal Code"
                    {...field}
                    onChange={(e) => {
                      const value = e?.target?.value?.trim?.();
                      if (value?.length > 6) {
                        return;
                      }
                      if(value?.length === 6){
                          fetchPostalCodeData(value);
                      }
                      form.setValue("city", "");
                    form.setValue("province", "");
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="City" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="province"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Province" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Country" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div> */}
      </div>
    </>
  );
};

export default PropertyAddress;
