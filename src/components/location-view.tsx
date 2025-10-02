"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetCountriesQuery, useGetStatesQuery, useGetRegionsQuery } from "@/store/locationApi"
import { MapPin, Globe, Flag } from "lucide-react"

export function LocationView() {
  const [selectedCountry, setSelectedCountry] = useState<number | undefined>()
  const [selectedState, setSelectedState] = useState<number | undefined>()
  const [selectedRegion, setSelectedRegion] = useState<number | undefined>()

  const { data: countriesData, isLoading: countriesLoading, error: countriesError } = useGetCountriesQuery()
  const { data: statesData, isLoading: statesLoading } = useGetStatesQuery(selectedCountry, {
    skip: !selectedCountry,
  })
  const { data: regionsData, isLoading: regionsLoading } = useGetRegionsQuery(selectedState, {
    skip: !selectedState,
  })

  const handleCountryChange = (countryId: string) => {
    setSelectedCountry(Number(countryId))
    setSelectedState(undefined)
    setSelectedRegion(undefined)
  }

  const handleStateChange = (stateId: string) => {
    setSelectedState(Number(stateId))
    setSelectedRegion(undefined)
  }

  const handleRegionChange = (regionId: string) => {
    setSelectedRegion(Number(regionId))
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Location Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Select your country, state, and region</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Location Information
            </CardTitle>
            <CardDescription>Choose your geographical location from the dropdowns below</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Country Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="country" className="flex items-center gap-2">
                <Flag className="w-4 h-4" />
                Country
              </Label>
              {countriesLoading ? (
                <div className="text-sm text-gray-500 dark:text-gray-400">Loading countries...</div>
              ) : countriesError ? (
                <div className="text-sm text-red-500">Error loading countries</div>
              ) : (
                <Select value={selectedCountry?.toString()} onValueChange={handleCountryChange}>
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countriesData?.data.map((country) => (
                      <SelectItem key={country.id} value={country.id.toString()}>
                        {country.country_name} ({country.country_code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* State Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="state" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                State
              </Label>
              {!selectedCountry ? (
                <div className="text-sm text-gray-500 dark:text-gray-400">Please select a country first</div>
              ) : statesLoading ? (
                <div className="text-sm text-gray-500 dark:text-gray-400">Loading states...</div>
              ) : (
                <Select
                  value={selectedState?.toString()}
                  onValueChange={handleStateChange}
                  disabled={!selectedCountry}
                >
                  <SelectTrigger id="state">
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                  <SelectContent>
                    {statesData?.data.map((state) => (
                      <SelectItem key={state.id} value={state.id.toString()}>
                        {state.state_name} ({state.state_code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Region Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="region" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Region
              </Label>
              {!selectedState ? (
                <div className="text-sm text-gray-500 dark:text-gray-400">Please select a state first</div>
              ) : regionsLoading ? (
                <div className="text-sm text-gray-500 dark:text-gray-400">Loading regions...</div>
              ) : (
                <Select
                  value={selectedRegion?.toString()}
                  onValueChange={handleRegionChange}
                  disabled={!selectedState}
                >
                  <SelectTrigger id="region">
                    <SelectValue placeholder="Select a region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regionsData?.data.map((region) => (
                      <SelectItem key={region.id} value={region.id.toString()}>
                        {region.region_name} ({region.region_code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Selected Location Summary */}
            {(selectedCountry || selectedState || selectedRegion) && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="text-sm font-semibold mb-2">Selected Location:</h3>
                <div className="space-y-1 text-sm">
                  {selectedCountry && (
                    <div>
                      <span className="font-medium">Country:</span>{" "}
                      {countriesData?.data.find((c) => c.id === selectedCountry)?.country_name}
                    </div>
                  )}
                  {selectedState && (
                    <div>
                      <span className="font-medium">State:</span>{" "}
                      {statesData?.data.find((s) => s.id === selectedState)?.state_name}
                    </div>
                  )}
                  {selectedRegion && (
                    <div>
                      <span className="font-medium">Region:</span>{" "}
                      {regionsData?.data.find((r) => r.id === selectedRegion)?.region_name}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
