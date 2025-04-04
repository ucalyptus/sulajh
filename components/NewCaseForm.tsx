'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"

const disputeCategories = [
  "Consumer",
  "Employment",
  "Property",
  "Business",
  "Contract",
  "Financial",
  "Other"
]

const contactMethods = [
  "Email",
  "Phone",
  "Mail",
  "Any"
]

export function NewCaseForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Claimant Information
  const [claimDetails, setClaimDetails] = useState('')
  const [claimantPhone, setClaimantPhone] = useState('')
  const [claimantAddress, setClaimantAddress] = useState('')
  const [preferredContact, setPreferredContact] = useState('Email')
  const [accountNumber, setAccountNumber] = useState('')

  // Respondent Information
  const [respondentEmail, setRespondentEmail] = useState('')
  const [respondentPhone, setRespondentPhone] = useState('')
  const [respondentAddress, setRespondentAddress] = useState('')
  const [relationship, setRelationship] = useState('')

  // Dispute Details
  const [incidentDate, setIncidentDate] = useState<Date>()
  const [incidentLocation, setIncidentLocation] = useState('')
  const [disputeAmount, setDisputeAmount] = useState('')
  const [disputeCategory, setDisputeCategory] = useState('Consumer')
  const [desiredResolution, setDesiredResolution] = useState('')

  // Evidence
  const [evidenceFiles, setEvidenceFiles] = useState<FileList | null>(null)
  const [evidenceNotes, setEvidenceNotes] = useState('')
  const [witnesses, setWitnesses] = useState<{name: string, contact: string}[]>([])

  // Previous Resolution Attempts
  const [priorContact, setPriorContact] = useState(false)
  const [priorContactDates, setPriorContactDates] = useState('')
  const [priorMethods, setPriorMethods] = useState('')
  const [priorResults, setPriorResults] = useState('')

  // Declaration
  const [truthStatement, setTruthStatement] = useState(false)
  const [signature, setSignature] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      // Upload evidence files first if any
      let evidenceUrls: string[] = []
      if (evidenceFiles) {
        const formData = new FormData()
        Array.from(evidenceFiles).forEach((file) => {
          formData.append('files', file)
        })
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        if (!uploadRes.ok) throw new Error('Failed to upload evidence files')
        evidenceUrls = await uploadRes.json()
      }

      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Claimant Information
          claimantRequest: claimDetails,
          claimantPhone,
          claimantAddress,
          preferredContact,
          accountNumber,

          // Respondent Information
          respondentEmail,
          respondentPhone,
          respondentAddress,
          relationship,

          // Dispute Details
          incidentDate,
          incidentLocation,
          disputeAmount: parseFloat(disputeAmount) || null,
          disputeCategory,
          desiredResolution,

          // Evidence
          evidenceFiles: evidenceUrls,
          evidenceNotes,
          witnesses,

          // Previous Resolution Attempts
          priorContact,
          priorContactDates,
          priorMethods,
          priorResults,

          // Declaration
          truthStatement,
          signature,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit claim')
      }

      router.push(`/cases/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit claim')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Claimant Information */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Claimant Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="claimantPhone">Phone Number</Label>
            <Input
              id="claimantPhone"
              value={claimantPhone}
              onChange={(e) => setClaimantPhone(e.target.value)}
              placeholder="Your phone number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferredContact">Preferred Contact Method</Label>
            <Select value={preferredContact} onValueChange={setPreferredContact}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {contactMethods.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="claimantAddress">Address</Label>
          <Textarea
            id="claimantAddress"
            value={claimantAddress}
            onChange={(e) => setClaimantAddress(e.target.value)}
            placeholder="Your address"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountNumber">ID/Account Number (if applicable)</Label>
          <Input
            id="accountNumber"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="Related account or ID number"
          />
        </div>
      </div>

      {/* Respondent Information */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Respondent Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="respondentEmail">Email <span className="text-red-500">*</span></Label>
            <Input
              id="respondentEmail"
              type="email"
              required
              value={respondentEmail}
              onChange={(e) => setRespondentEmail(e.target.value)}
              placeholder="Respondent's email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="respondentPhone">Phone Number (if known)</Label>
            <Input
              id="respondentPhone"
              value={respondentPhone}
              onChange={(e) => setRespondentPhone(e.target.value)}
              placeholder="Respondent's phone number"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="respondentAddress">Address (if known)</Label>
          <Textarea
            id="respondentAddress"
            value={respondentAddress}
            onChange={(e) => setRespondentAddress(e.target.value)}
            placeholder="Respondent's address"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="relationship">Relationship to Claimant</Label>
          <Input
            id="relationship"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            placeholder="e.g., Service Provider, Employer, etc."
          />
        </div>
      </div>

      {/* Dispute Details */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Dispute Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Date of Incident</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !incidentDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {incidentDate ? format(incidentDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={incidentDate}
                  onSelect={setIncidentDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="disputeCategory">Category of Dispute</Label>
            <Select value={disputeCategory} onValueChange={setDisputeCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {disputeCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="incidentLocation">Location/Venue</Label>
          <Input
            id="incidentLocation"
            value={incidentLocation}
            onChange={(e) => setIncidentLocation(e.target.value)}
            placeholder="Where did this occur?"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="disputeAmount">Amount in Dispute (if monetary)</Label>
          <Input
            id="disputeAmount"
            type="number"
            step="0.01"
            value={disputeAmount}
            onChange={(e) => setDisputeAmount(e.target.value)}
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="claimDetails">Description of Issue <span className="text-red-500">*</span></Label>
          <Textarea
            id="claimDetails"
            required
            value={claimDetails}
            onChange={(e) => setClaimDetails(e.target.value)}
            placeholder="Describe your claim in detail"
            rows={6}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="desiredResolution">Desired Resolution/Remedy</Label>
          <Textarea
            id="desiredResolution"
            value={desiredResolution}
            onChange={(e) => setDesiredResolution(e.target.value)}
            placeholder="What outcome are you seeking?"
            rows={4}
          />
        </div>
      </div>

      {/* Evidence */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Evidence</h2>
        
        <div className="space-y-2">
          <Label htmlFor="evidenceFiles">Upload Documents</Label>
          <Input
            id="evidenceFiles"
            type="file"
            multiple
            onChange={(e) => setEvidenceFiles(e.target.files)}
            className="cursor-pointer"
          />
          <p className="text-sm text-gray-500">Upload receipts, contracts, communications, etc.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="evidenceNotes">Description of Evidence</Label>
          <Textarea
            id="evidenceNotes"
            value={evidenceNotes}
            onChange={(e) => setEvidenceNotes(e.target.value)}
            placeholder="Describe the evidence you're providing"
            rows={3}
          />
        </div>
      </div>

      {/* Previous Resolution Attempts */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Previous Resolution Attempts</h2>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="priorContact"
            checked={priorContact}
            onCheckedChange={setPriorContact}
          />
          <Label htmlFor="priorContact">Have you previously contacted the respondent?</Label>
        </div>

        {priorContact && (
          <>
            <div className="space-y-2">
              <Label htmlFor="priorContactDates">Dates of Previous Contact</Label>
              <Input
                id="priorContactDates"
                value={priorContactDates}
                onChange={(e) => setPriorContactDates(e.target.value)}
                placeholder="When did you contact them?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priorMethods">Methods of Contact</Label>
              <Input
                id="priorMethods"
                value={priorMethods}
                onChange={(e) => setPriorMethods(e.target.value)}
                placeholder="How did you contact them? (e.g., email, phone)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priorResults">Results of Previous Attempts</Label>
              <Textarea
                id="priorResults"
                value={priorResults}
                onChange={(e) => setPriorResults(e.target.value)}
                placeholder="What was the outcome of previous contact attempts?"
                rows={3}
              />
            </div>
          </>
        )}
      </div>

      {/* Declaration */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Declaration</h2>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="truthStatement"
            checked={truthStatement}
            onCheckedChange={setTruthStatement}
            required
          />
          <Label htmlFor="truthStatement" className="text-sm">
            I declare that the information provided is true and accurate to the best of my knowledge
          </Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="signature">Electronic Signature <span className="text-red-500">*</span></Label>
          <Input
            id="signature"
            required
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            placeholder="Type your full name as signature"
          />
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <Button type="submit" disabled={isSubmitting || !truthStatement}>
        {isSubmitting ? 'Submitting...' : 'Submit Claim'}
      </Button>
    </form>
  )
} 