import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'

// Register fonts (using system fonts for simplicity)
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
    borderBottom: '1 solid #e5e5e5',
    paddingBottom: 5,
  },
  paragraph: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#333',
    marginBottom: 10,
  },
  highlightBox: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 4,
    marginBottom: 15,
  },
  financialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  financialItem: {
    width: '50%',
    marginBottom: 15,
  },
  financialLabel: {
    fontSize: 9,
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  financialValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  financialValueGreen: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  highlightsList: {
    marginBottom: 10,
  },
  highlightItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 10,
  },
  bulletPoint: {
    width: 15,
    fontSize: 11,
    color: '#c9a961',
  },
  highlightText: {
    flex: 1,
    fontSize: 11,
    color: '#333',
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
  watermark: {
    position: 'absolute',
    top: '40%',
    left: '20%',
    fontSize: 60,
    color: '#f0f0f0',
    transform: 'rotate(-30deg)',
    opacity: 0.5,
  },
  disclaimer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#fefce8',
    borderRadius: 4,
  },
  disclaimerTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#854d0e',
    marginBottom: 5,
  },
  disclaimerText: {
    fontSize: 8,
    color: '#854d0e',
    lineHeight: 1.5,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 50,
    fontSize: 10,
    color: '#999',
  },
})

interface ProspectusData {
  title: string
  propertyType?: string
  location?: string
  targetReturn?: string
  minimumInvestment?: number
  projectTimeline?: string
  totalRaise?: number
  description?: string
  highlights?: string[]
  investmentStructure?: string
  riskFactors?: string[]
  isDraft?: boolean
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function ProspectusDocument({data}: {data: ProspectusData}) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark for drafts */}
        {data.isDraft && <Text style={styles.watermark}>DRAFT</Text>}

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>Golden Gate Home Advisors</Text>
          <Text style={styles.logoSubtext}>INVESTMENT PROSPECTUS</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.subtitle}>
          {data.propertyType && `${data.propertyType} • `}
          {data.location || 'San Francisco Bay Area'}
        </Text>

        {/* Financial Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Investment Overview</Text>
          <View style={styles.highlightBox}>
            <View style={styles.financialGrid}>
              <View style={styles.financialItem}>
                <Text style={styles.financialLabel}>Target Return</Text>
                <Text style={styles.financialValueGreen}>
                  {data.targetReturn || 'TBD'}
                </Text>
              </View>
              <View style={styles.financialItem}>
                <Text style={styles.financialLabel}>Minimum Investment</Text>
                <Text style={styles.financialValue}>
                  {data.minimumInvestment
                    ? formatCurrency(data.minimumInvestment)
                    : 'TBD'}
                </Text>
              </View>
              <View style={styles.financialItem}>
                <Text style={styles.financialLabel}>Project Timeline</Text>
                <Text style={styles.financialValue}>
                  {data.projectTimeline || 'TBD'}
                </Text>
              </View>
              <View style={styles.financialItem}>
                <Text style={styles.financialLabel}>Total Raise</Text>
                <Text style={styles.financialValue}>
                  {data.totalRaise ? formatCurrency(data.totalRaise) : 'TBD'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Description */}
        {data.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Project Description</Text>
            <Text style={styles.paragraph}>{data.description}</Text>
          </View>
        )}

        {/* Highlights */}
        {data.highlights && data.highlights.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Investment Highlights</Text>
            <View style={styles.highlightsList}>
              {data.highlights.map((highlight, index) => (
                <View key={index} style={styles.highlightItem}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.highlightText}>{highlight}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Investment Structure */}
        {data.investmentStructure && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Investment Structure</Text>
            <Text style={styles.paragraph}>{data.investmentStructure}</Text>
          </View>
        )}

        {/* Risk Factors */}
        {data.riskFactors && data.riskFactors.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Risk Factors</Text>
            <View style={styles.highlightsList}>
              {data.riskFactors.map((risk, index) => (
                <View key={index} style={styles.highlightItem}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.highlightText}>{risk}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerTitle}>Important Disclaimer</Text>
          <Text style={styles.disclaimerText}>
            This prospectus is for informational purposes only and does not
            constitute an offer to sell or a solicitation of an offer to buy any
            securities. Investment in real estate involves substantial risk,
            including possible loss of principal. Past performance is not
            indicative of future results. Investors should conduct their own due
            diligence and consult with financial, legal, and tax advisors before
            making any investment decisions.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Golden Gate Home Advisors | Confidential
          </Text>
          <Text style={styles.footerText}>Generated: {currentDate}</Text>
        </View>

        <Text
          style={styles.pageNumber}
          render={({pageNumber, totalPages}) =>
            `Page ${pageNumber} of ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  )
}

export type {ProspectusData}
