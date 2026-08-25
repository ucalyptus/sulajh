'use client'

import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { createCase } from '@/src/server/cases'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import * as stylex from "@stylexjs/stylex"
import { colors, spacing } from "@/styles/tokens.stylex"

const styles = stylex.create({
  form: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[8],
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[4],
  },
  heading: {
    fontSize: "1.125rem",
    fontWeight: 600,
    margin: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: {
      default: "1fr",
      "@media (min-width: 768px)": "repeat(2, 1fr)",
    },
    gap: spacing[4],
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[2],
  },
  rowGroup: {
    display: "flex",
    alignItems: "center",
    gap: spacing[2],
  },
  requiredStar: {
    color: colors.red500,
  },
  dateButton: {
    width: "100%",
    justifyContent: "flex-start",
    textAlign: "left",
    fontWeight: 400,
  },
  placeholderText: {
    color: colors.mutedForeground,
  },
  helperText: {
    fontSize: "0.875rem",
    color: colors.gray500,
    margin: 0,
  },
  errorText: {
    color: colors.red500,
    fontSize: "0.875rem",
  },
  fileInput: {
    cursor: "pointer",
  },
})

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
    setIsSubmitting(true)
    setError('')

    try {
      const fullClaimText = [
        claimDetails,
        claimantPhone && `Claimant Phone: ${claimantPhone}`,
        claimantAddress && `Claimant Address: ${claimantAddress}`,
        preferredContact && `Preferred Contact: ${preferredContact}`,
        accountNumber && `Account/ID Number: ${accountNumber}`,
        incidentDate && `Incident Date: ${format(incidentDate, 'PPP')}`,
        incidentLocation && `Incident Location: ${incidentLocation}`,
        disputeAmount && `Dispute Amount: ${disputeAmount}`,
        disputeCategory && `Category: ${disputeCategory}`,
        desiredResolution && `Desired Resolution: ${desiredResolution}`,
        evidenceNotes && `Evidence Notes: ${evidenceNotes}`,
        priorContact && `Prior Contact: ${priorContactDates}, Methods: ${priorMethods}, Results: ${priorResults}`,
        signature && `Signed by: ${signature}`
      ].filter(Boolean).join('\n\n')

      const result = await createCase({
        data: {
          claimantRequest: fullClaimText,
          respondentEmail,
        }
      })

      if (result.error) {
        setError(result.error)
      } else {
        router.navigate({ to: '/cases/$id', params: { id: String(result.id) } })
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred while creating the case')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} {...stylex.props(styles.form)}>
      {/* Claimant Information */}
      <div {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.heading)}>Claimant Information</h2>

        <div {...stylex.props(styles.grid)}>
          <div {...stylex.props(styles.fieldGroup)}>
            <Label htmlFor="claimantPhone">Phone Number</Label>
            <Input
              id="claimantPhone"
              value={claimantPhone}
              onChange={(e) => setClaimantPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div {...stylex.props(styles.fieldGroup)}>
            <Label htmlFor="preferredContact">Preferred Contact Method</Label>
            <Select value={preferredContact} onValueChange={setPreferredContact}>
              <SelectTrigger>
                <SelectValue placeholder="Select contact method" />
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

        <div {...stylex.props(styles.fieldGroup)}>
          <Label htmlFor="claimantAddress">Address</Label>
          <Textarea
            id="claimantAddress"
            value={claimantAddress}
            onChange={(e) => setClaimantAddress(e.target.value)}
            placeholder="Street address, city, state, postal code"
          />
        </div>

        <div {...stylex.props(styles.fieldGroup)}>
          <Label htmlFor="accountNumber">ID/Account Number (if applicable)</Label>
          <Input
            id="accountNumber"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="e.g., Order #, Account #, License #"
          />
        </div>
      </div>

      {/* Respondent Information */}
      <div {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.heading)}>Respondent Information</h2>

        <div {...stylex.props(styles.grid)}>
          <div {...stylex.props(styles.fieldGroup)}>
            <Label htmlFor="respondentEmail">Email <span {...stylex.props(styles.requiredStar)}>*</span></Label>
            <Input
              id="respondentEmail"
              type="email"
              value={respondentEmail}
              onChange={(e) => setRespondentEmail(e.target.value)}
              placeholder="respondent@example.com"
              required
            />
          </div>

          <div {...stylex.props(styles.fieldGroup)}>
            <Label htmlFor="respondentPhone">Phone Number (if known)</Label>
            <Input
              id="respondentPhone"
              value={respondentPhone}
              onChange={(e) => setRespondentPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>

        <div {...stylex.props(styles.fieldGroup)}>
          <Label htmlFor="respondentAddress">Address (if known)</Label>
          <Textarea
            id="respondentAddress"
            value={respondentAddress}
            onChange={(e) => setRespondentAddress(e.target.value)}
            placeholder="Street address, city, state, postal code"
          />
        </div>

        <div {...stylex.props(styles.fieldGroup)}>
          <Label htmlFor="relationship">Relationship to Claimant</Label>
          <Input
            id="relationship"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            placeholder="e.g., Merchant/Customer, Employer/Employee, Landlord/Tenant"
          />
        </div>
      </div>

      {/* Dispute Details */}
      <div {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.heading)}>Dispute Details</h2>

        <div {...stylex.props(styles.grid)}>
          <div {...stylex.props(styles.fieldGroup)}>
            <Label>Date of Incident</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  style={[styles.dateButton, !incidentDate && styles.placeholderText]}
                >
                  <CalendarIcon style={{ marginRight: 8, width: 16, height: 16 }} />
                  {incidentDate ? format(incidentDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent style={{ width: 'auto', padding: 0 }}>
                <Calendar
                  mode="single"
                  selected={incidentDate}
                  onSelect={setIncidentDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div {...stylex.props(styles.fieldGroup)}>
            <Label htmlFor="disputeCategory">Category of Dispute</Label>
            <Select value={disputeCategory} onValueChange={setDisputeCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
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

        <div {...stylex.props(styles.fieldGroup)}>
          <Label htmlFor="incidentLocation">Location/Venue</Label>
          <Input
            id="incidentLocation"
            value={incidentLocation}
            onChange={(e) => setIncidentLocation(e.target.value)}
            placeholder="Where did the issue occur?"
          />
        </div>

        <div {...stylex.props(styles.fieldGroup)}>
          <Label htmlFor="disputeAmount">Amount in Dispute (if monetary)</Label>
          <Input
            id="disputeAmount"
            value={disputeAmount}
            onChange={(e) => setDisputeAmount(e.target.value)}
            placeholder="e.g., $1,500.00"
          />
        </div>

        <div {...stylex.props(styles.fieldGroup)}>
          <Label htmlFor="claimDetails">Description of Issue <span {...stylex.props(styles.requiredStar)}>*</span></Label>
          <Textarea
            id="claimDetails"
            required
            value={claimDetails}
            onChange={(e) => setClaimDetails(e.target.value)}
            placeholder="Provide a detailed description of what happened..."
            rows={6}
          />
        </div>

        <div {...stylex.props(styles.fieldGroup)}>
          <Label htmlFor="desiredResolution">Desired Resolution/Remedy</Label>
          <Textarea
            id="desiredResolution"
            value={desiredResolution}
            onChange={(e) => setDesiredResolution(e.target.value)}
            placeholder="What outcome are you seeking? (e.g., full refund, replacement, specific performance)"
            rows={3}
          />
        </div>
      </div>

      {/* Evidence */}
      <div {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.heading)}>Evidence</h2>

        <div {...stylex.props(styles.fieldGroup)}>
          <Label htmlFor="evidenceFiles">Upload Documents</Label>
          <Input
            id="evidenceFiles"
            type="file"
            multiple
            onChange={(e) => setEvidenceFiles(e.target.files)}
            style={styles.fileInput}
          />
          <p {...stylex.props(styles.helperText)}>Upload receipts, contracts, communications, etc.</p>
        </div>

        <div {...stylex.props(styles.fieldGroup)}>
          <Label htmlFor="evidenceNotes">Description of Evidence</Label>
          <Textarea
            id="evidenceNotes"
            value={evidenceNotes}
            onChange={(e) => setEvidenceNotes(e.target.value)}
            placeholder="Describe the documents or evidence you are submitting..."
            rows={3}
          />
        </div>
      </div>

      {/* Previous Resolution Attempts */}
      <div {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.heading)}>Previous Resolution Attempts</h2>

        <div {...stylex.props(styles.rowGroup)}>
          <Switch
            id="priorContact"
            checked={priorContact}
            onCheckedChange={setPriorContact}
          />
          <Label htmlFor="priorContact">Have you attempted to resolve this directly with the respondent?</Label>
        </div>

        {priorContact && (
          <>
            <div {...stylex.props(styles.fieldGroup)}>
              <Label htmlFor="priorContactDates">Dates of Previous Contact</Label>
              <Input
                id="priorContactDates"
                value={priorContactDates}
                onChange={(e) => setPriorContactDates(e.target.value)}
                placeholder="e.g., Jan 15, 2024; Feb 2, 2024"
              />
            </div>

            <div {...stylex.props(styles.fieldGroup)}>
              <Label htmlFor="priorMethods">Methods of Contact</Label>
              <Input
                id="priorMethods"
                value={priorMethods}
                onChange={(e) => setPriorMethods(e.target.value)}
                placeholder="e.g., Email, Phone calls, Certified mail"
              />
            </div>

            <div {...stylex.props(styles.fieldGroup)}>
              <Label htmlFor="priorResults">Results of Previous Attempts</Label>
              <Textarea
                id="priorResults"
                value={priorResults}
                onChange={(e) => setPriorResults(e.target.value)}
                placeholder="What was the outcome of those attempts?"
                rows={3}
              />
            </div>
          </>
        )}
      </div>

      {/* Declaration */}
      <div {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.heading)}>Declaration</h2>

        <div {...stylex.props(styles.rowGroup)}>
          <Switch
            id="truthStatement"
            checked={truthStatement}
            onCheckedChange={setTruthStatement}
          />
          <Label htmlFor="truthStatement">
            I declare that the information provided is true and accurate to the best of my knowledge
          </Label>
        </div>

        <div {...stylex.props(styles.fieldGroup)}>
          <Label htmlFor="signature">Electronic Signature <span {...stylex.props(styles.requiredStar)}>*</span></Label>
          <Input
            id="signature"
            required
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            placeholder="Type your full legal name as signature"
          />
        </div>
      </div>

      {error && (
        <div {...stylex.props(styles.errorText)}>{error}</div>
      )}

      <Button type="submit" disabled={isSubmitting || !truthStatement}>
        {isSubmitting ? 'Filing Claim...' : 'Submit Claim'}
      </Button>
    </form>
  )
}
