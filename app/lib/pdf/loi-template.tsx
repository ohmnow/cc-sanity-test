import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'

Font.register({
  family: 'Helvetica',
  fonts: [
    {src: 'Helvetica'},
    {src: 'Helvetica-Bold', fontWeight: 'bold'},
  ],
})

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: '#1a1a1a',
  },
  header: {
    marginBottom: 30,
    borderBottom: '2 solid #c9a961',
    paddingBottom: 20,
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  logoSubtext: {
    fontSize: 10,
    color: '#666',
    letterSpacing: 1,
  },
  documentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 5,
    marginTop: 20,
  },
  documentSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
    backgroundColor: '#f8f8f8',
    padding: 8,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottom: '1 solid #f0f0f0',
  },
  label: {
    width: '40%',
    fontSize: 10,
    color: '#666',
    fontWeight: 'bold',
  },
  value: {
    width: '60%',
    fontSize: 11,
    color: '#1a1a1a',
  },
  highlightValue: {
    width: '60%',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  paragraph: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#333',
    marginBottom: 10,
  },
  termsBox: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 4,
    marginBottom: 15,
  },
  termItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  checkmark: {
    width: 20,
    fontSize: 12,
    color: '#16a34a',
  },
  termText: {
    flex: 1,
    fontSize: 10,
    color: '#333',
    lineHeight: 1.4,
  },
  signatureSection: {
    marginTop: 40,
  },
  signatureGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  signatureBlock: {
    width: '45%',
  },
  signatureLine: {
    borderBottom: '1 solid #1a1a1a',
    marginBottom: 5,
    height: 40,
  },
  signatureLabel: {
    fontSize: 9,
    color: '#666',
    marginBottom: 3,
  },
  signatureName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  signatureDate: {
    fontSize: 10,
    color: '#666',
    marginTop: 3,
  },
  statusBadge: {
    padding: '4 12',
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  statusSubmitted: {
    backgroundColor: '#fef3c7',
  },
  statusApproved: {
    backgroundColor: '#dcfce7',
  },
  statusRejected: {
    backgroundColor: '#fee2e2',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusTextSubmitted: {
    color: '#92400e',
  },
  statusTextApproved: {
    color: '#166534',
  },
  statusTextRejected: {
    color: '#991b1b',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    borderTop: '1 solid #e5e5e5',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 8,
    color: '#999',
  },
  loiNumber: {
    fontSize: 10,
    color: '#666',
    textAlign: 'right',
    marginBottom: 10,
  },
  watermark: {
    position: 'absolute',
    top: '40%',
    left: '20%',
    fontSize: 60,
    color: '#f0f0f0',
    transform: 'rotate(-30deg)',
    opacity: 0.5,
  },
  notesSection: {
    backgroundColor: '#f0f9ff',
    padding: 15,
    borderRadius: 4,
    marginTop: 15,
  },
  notesTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0369a1',
    marginBottom: 5,
  },
  notesText: {
    fontSize: 10,
    color: '#0c4a6e',
    lineHeight: 1.5,
  },
})

interface LOIData {
  loiId: string
  status: 'submitted' | 'review' | 'approved' | 'rejected'
  submittedAt: string
  reviewedAt?: string
  investmentAmount: number
  investorNotes?: string
  investor: {
    name: string
    email: string
    phone?: string
    accreditedStatus?: string
  }
  prospectus: {
    title: string
    targetReturn?: string
    minimumInvestment?: number
    propertyType?: string
    location?: string
  }
  countersignedBy?: string
  countersignedAt?: string
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'submitted':
      return 'PENDING REVIEW'
    case 'review':
      return 'UNDER REVIEW'
    case 'approved':
      return 'APPROVED'
    case 'rejected':
      return 'DECLINED'
    default:
      return status.toUpperCase()
  }
}

export function LOIDocument({data}: {data: LOIData}) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const isApproved = data.status === 'approved'
  const isPending = data.status === 'submitted' || data.status === 'review'

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark for pending LOIs */}
        {isPending && <Text style={styles.watermark}>PENDING</Text>}

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>Golden Gate Home Advisors</Text>
          <Text style={styles.logoSubtext}>LETTER OF INTENT</Text>
        </View>

        {/* LOI Number */}
        <Text style={styles.loiNumber}>LOI #{data.loiId.slice(-8).toUpperCase()}</Text>

        {/* Status Badge */}
        <View
          style={[
            styles.statusBadge,
            data.status === 'submitted' || data.status === 'review'
              ? styles.statusSubmitted
              : data.status === 'approved'
                ? styles.statusApproved
                : styles.statusRejected,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              data.status === 'submitted' || data.status === 'review'
                ? styles.statusTextSubmitted
                : data.status === 'approved'
                  ? styles.statusTextApproved
                  : styles.statusTextRejected,
            ]}
          >
            {getStatusLabel(data.status)}
          </Text>
        </View>

        {/* Document Title */}
        <Text style={styles.documentTitle}>Letter of Intent</Text>
        <Text style={styles.documentSubtitle}>
          Investment Interest Declaration
        </Text>

        {/* Investment Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INVESTMENT DETAILS</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Investment Opportunity:</Text>
            <Text style={styles.value}>{data.prospectus.title}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Investment Amount:</Text>
            <Text style={styles.highlightValue}>
              {formatCurrency(data.investmentAmount)}
            </Text>
          </View>
          {data.prospectus.targetReturn && (
            <View style={styles.row}>
              <Text style={styles.label}>Target Return:</Text>
              <Text style={styles.value}>{data.prospectus.targetReturn}</Text>
            </View>
          )}
          {data.prospectus.propertyType && (
            <View style={styles.row}>
              <Text style={styles.label}>Property Type:</Text>
              <Text style={styles.value}>{data.prospectus.propertyType}</Text>
            </View>
          )}
          {data.prospectus.location && (
            <View style={styles.row}>
              <Text style={styles.label}>Location:</Text>
              <Text style={styles.value}>{data.prospectus.location}</Text>
            </View>
          )}
        </View>

        {/* Investor Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INVESTOR INFORMATION</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Investor Name:</Text>
            <Text style={styles.value}>{data.investor.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email Address:</Text>
            <Text style={styles.value}>{data.investor.email}</Text>
          </View>
          {data.investor.phone && (
            <View style={styles.row}>
              <Text style={styles.label}>Phone Number:</Text>
              <Text style={styles.value}>{data.investor.phone}</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.label}>Accreditation Status:</Text>
            <Text style={styles.value}>
              {data.investor.accreditedStatus || 'Pending Verification'}
            </Text>
          </View>
        </View>

        {/* Submission Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SUBMISSION DETAILS</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Date Submitted:</Text>
            <Text style={styles.value}>{formatDate(data.submittedAt)}</Text>
          </View>
          {data.reviewedAt && (
            <View style={styles.row}>
              <Text style={styles.label}>Date Reviewed:</Text>
              <Text style={styles.value}>{formatDate(data.reviewedAt)}</Text>
            </View>
          )}
        </View>

        {/* Investor Notes */}
        {data.investorNotes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>Investor Notes</Text>
            <Text style={styles.notesText}>{data.investorNotes}</Text>
          </View>
        )}

        {/* Terms Acknowledgment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACKNOWLEDGMENTS</Text>
          <View style={styles.termsBox}>
            <View style={styles.termItem}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.termText}>
                I confirm that I meet the accredited investor requirements as
                defined by the SEC.
              </Text>
            </View>
            <View style={styles.termItem}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.termText}>
                I understand that this Letter of Intent is non-binding and does
                not guarantee participation in the investment.
              </Text>
            </View>
            <View style={styles.termItem}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.termText}>
                I have reviewed the investment prospectus and understand the
                associated risks.
              </Text>
            </View>
            <View style={styles.termItem}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.termText}>
                I authorize Golden Gate Home Advisors to contact me regarding
                this investment opportunity.
              </Text>
            </View>
          </View>
        </View>

        {/* Signature Section */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureGrid}>
            {/* Investor Signature */}
            <View style={styles.signatureBlock}>
              <Text style={styles.signatureLabel}>INVESTOR</Text>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureName}>{data.investor.name}</Text>
              <Text style={styles.signatureDate}>
                Date: {formatDate(data.submittedAt)}
              </Text>
            </View>

            {/* Company Countersignature */}
            <View style={styles.signatureBlock}>
              <Text style={styles.signatureLabel}>GOLDEN GATE HOME ADVISORS</Text>
              <View style={styles.signatureLine} />
              {isApproved && data.countersignedBy ? (
                <>
                  <Text style={styles.signatureName}>{data.countersignedBy}</Text>
                  <Text style={styles.signatureDate}>
                    Date: {data.countersignedAt ? formatDate(data.countersignedAt) : 'Pending'}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.signatureName}>Pending Approval</Text>
                  <Text style={styles.signatureDate}>Date: _____________</Text>
                </>
              )}
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Golden Gate Home Advisors | Confidential Document
          </Text>
          <Text style={styles.footerText}>Generated: {currentDate}</Text>
        </View>
      </Page>
    </Document>
  )
}

export type {LOIData}
