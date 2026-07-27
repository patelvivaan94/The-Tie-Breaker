import { DecisionAnalysis } from '../types';

export interface PresetTemplate {
  id: string;
  title: string;
  description: string;
  category: 'Career & Work' | 'Lifestyle & Home' | 'Tech & Money' | 'Education';
  prompt: string;
  options: string[];
  context: string;
  sampleAnalysis: DecisionAnalysis;
}

export const PRESET_DECISIONS: PresetTemplate[] = [
  {
    id: 'buy-vs-rent',
    title: 'Buy a House vs. Rent & Invest',
    description: 'Evaluate wealth building, mobility, maintenance stress, and market stability.',
    category: 'Lifestyle & Home',
    prompt: 'Should I buy my first home now or keep renting and invest the surplus in index funds?',
    options: ['Buy a Starter Home', 'Rent & Invest Surplus'],
    context: 'Current interest rates around 6.5%, planning to stay in the city for 5-7 years, $70k saved for down payment.',
    sampleAnalysis: {
      title: 'Starter Home Purchase vs. Renting & Stock Investing',
      summary: 'A classic financial and lifestyle conflict balancing forced real estate equity and ownership control against liquidity, flexibility, and investment diversification.',
      options: [
        {
          id: 'opt-buy',
          name: 'Buy a Starter Home',
          tagline: 'Build home equity, stabilize housing cost, gain full personal control',
          pros: [
            { id: 'p1', text: 'Forced monthly savings building real property equity over time', importance: 5, category: 'Financial', explanation: 'Each mortgage payment pays down principal rather than paying a landlord.' },
            { id: 'p2', text: 'Fixed mortgage payment insulates against rising rent costs', importance: 4, category: 'Financial', explanation: 'Principal & interest stay stable, guarding against annual 5-8% rent spikes.' },
            { id: 'p3', text: 'Full freedom to customize, remodel, and optimize your living space', importance: 4, category: 'Lifestyle', explanation: 'No landlord restrictions on pets, paint, or structural upgrades.' }
          ],
          cons: [
            { id: 'c1', text: 'High upfront closing costs and illiquid capital tie-up', severity: 5, category: 'Financial', explanation: 'Closing costs (2-5%) and down payment cannot be accessed quickly in emergencies.' },
            { id: 'c2', text: '100% financial responsibility for repairs, roof, HVAC, and tax increases', severity: 4, category: 'Effort', explanation: 'Property taxes, HOA fees, and maintenance average 1-2% of home value annually.' },
            { id: 'c3', text: 'Reduced job and geographical mobility if needing to sell within 3 years', severity: 4, category: 'Career', explanation: 'Selling before 5 years often leads to net financial loss due to realtor fees.' }
          ],
          swot: {
            strengths: ['Hedge against inflation', 'Emotional security of ownership', 'Tax advantages (mortgage interest deduction)'],
            weaknesses: ['High friction to sell', 'Maintenance surprise expenses', 'Illiquid asset'],
            opportunities: ['Property appreciation over 7+ years', 'Option to convert to rental unit later', 'Refinance if interest rates drop'],
            threats: ['Local real estate downturn', 'Unexpected major structural repairs', 'Property tax hikes']
          }
        },
        {
          id: 'opt-rent',
          name: 'Rent & Invest Surplus',
          tagline: 'Maximum mobility, liquid index fund growth, zero maintenance friction',
          pros: [
            { id: 'p1', text: 'Capital stays 100% liquid in broad-market S&P 500 index funds', importance: 5, category: 'Financial', explanation: 'Stock market historically returns ~9-10% long term with zero closing fees.' },
            { id: 'p2', text: 'Complete geographical mobility for new career opportunities', importance: 5, category: 'Career', explanation: 'Can move cities or accept remote promotions without selling real estate.' },
            { id: 'p3', text: 'Zero repair hassle or unexpected emergency maintenance bills', importance: 4, category: 'Lifestyle', explanation: 'Broken water heater or leaky roof is 100% the landlord responsibility.' }
          ],
          cons: [
            { id: 'c1', text: 'Subject to annual rent increases and lease non-renewals', severity: 4, category: 'Financial', explanation: 'Landlord can raise rent or decide to sell the property at lease end.' },
            { id: 'c2', text: 'No property appreciation equity built over time', severity: 4, category: 'Financial', explanation: 'Rent money is a sunk operational cost for shelter.' },
            { id: 'c3', text: 'Requires strict discipline to actually invest the saved difference', severity: 3, category: 'Personal', explanation: 'If surplus rent savings get spent on lifestyle creep, wealth building stalls.' }
          ],
          swot: {
            strengths: ['Liquid assets', 'Total geographical flexibility', 'Predictable monthly expenses'],
            weaknesses: ['No real estate leverage', 'Vulnerable to landlord decisions', 'No property tax deductions'],
            opportunities: ['Capitalize on stock market pullbacks', 'Move closer to job hubs easily', 'Deploy capital into business/career'],
            threats: ['Hyper-inflation in rent prices', 'Market volatility panic selling', 'Missed real estate appreciation']
          }
        }
      ],
      comparisonCriteria: [
        {
          key: 'wealth-growth',
          name: 'Long-Term Wealth Potential',
          description: 'Expected net worth trajectory over 7-10 years.',
          defaultWeight: 5,
          scores: [
            { optionId: 'opt-buy', score: 8, reasoning: 'Strong long-term return via leverage and forced savings, though front-loaded with interest.' },
            { optionId: 'opt-rent', score: 8, reasoning: 'Historically comparable or higher returns if savings are diligently invested in index funds.' }
          ]
        },
        {
          key: 'flexibility',
          name: 'Geographic & Career Flexibility',
          description: 'Ease of moving for a job promotion, relationship, or lifestyle change.',
          defaultWeight: 4,
          scores: [
            { optionId: 'opt-buy', score: 3, reasoning: 'High exit cost (6% broker fees + closing) makes moving under 3-5 years expensive.' },
            { optionId: 'opt-rent', score: 10, reasoning: 'Can relocate cleanly at lease end or break lease with modest penalty.' }
          ]
        },
        {
          key: 'peace-of-mind',
          name: 'Low Maintenance Stress',
          description: 'Mental peace regarding property upkeep and unforeseen costs.',
          defaultWeight: 3,
          scores: [
            { optionId: 'opt-buy', score: 4, reasoning: 'Homeowners bear full mental and financial weight of surprise repairs.' },
            { optionId: 'opt-rent', score: 9, reasoning: 'Landlord handles major repairs and property maintenance.' }
          ]
        },
        {
          key: 'stability',
          name: 'Housing Cost Stability',
          description: 'Predictability of monthly housing costs over 5+ years.',
          defaultWeight: 4,
          scores: [
            { optionId: 'opt-buy', score: 9, reasoning: 'Fixed rate mortgage locks in baseline monthly cost for decades.' },
            { optionId: 'opt-rent', score: 4, reasoning: 'Subject to local market rent increases upon lease renewal.' }
          ]
        }
      ],
      verdict: {
        winnerOptionId: 'opt-rent',
        winnerName: 'Rent & Invest Surplus',
        confidencePercentage: 82,
        headline: 'Rent & Invest holds the edge if flexibility and liquid market growth matter most in your 5-year horizon.',
        detailedRecommendation: 'With interest rates near 6.5% and a 5-7 year stay horizon, renting while aggressively investing your $70k down payment in index funds offers superior liquidity and lower downside risk. Buying becomes the winner if you plan to stay 7+ years or value emotional permanence over financial liquidity.',
        whenToChooseOthers: [
          { optionId: 'opt-buy', condition: 'If you are 100% committed to remaining in the same neighborhood for 7+ years and prioritize housing permanence over stock portfolio liquidity.' }
        ],
        blindSpots: [
          'Property taxes and homeowners insurance premiums often increase 5-10% yearly, altering mortgage calculations.',
          'Renters often fail to invest the exact monthly difference, destroying the financial advantage of renting.',
          'Closing costs on both buying (3%) and selling (6%) consume roughly 9% of total property value.'
        ],
        diagnosticQuestions: [
          'How confident are you that you won’t want to move cities or switch jobs in the next 48 months?',
          'Will you actually set up an automatic recurring monthly transfer to invest the rent savings difference into index funds?',
          'Does having a surprise $4,000 plumbing bill cause you intense stress or mild inconvenience?'
        ]
      }
    }
  },
  {
    id: 'remote-vs-office',
    title: 'Remote Job vs. In-Office Offer',
    description: 'Weigh daily commute, salary, career visibility, and work-life balance.',
    category: 'Career & Work',
    prompt: 'Should I take a fully remote software job with a slightly lower salary or an in-office job with a 15% higher salary?',
    options: ['Fully Remote Job', 'In-Office Job (+15% Pay)'],
    context: 'Commute for in-office job is 45 minutes each way (1.5 hrs/day). I value focused deep work and spending time with family.',
    sampleAnalysis: {
      title: 'Fully Remote Job vs. In-Office Role with 15% Pay Premium',
      summary: 'A classic trade-off between direct monetary compensation and personal time autonomy, commute reduction, and lifestyle control.',
      options: [
        {
          id: 'opt-remote',
          name: 'Fully Remote Job',
          tagline: 'Reclaim 7.5 hours/week from commuting, gain location freedom and deep focus',
          pros: [
            { id: 'p1', text: 'Saves 1.5 hours of daily commute (~360 hours per year of free time)', importance: 5, category: 'Lifestyle', explanation: 'Equivalent to gaining 15 entire extra days of personal time each year.' },
            { id: 'p2', text: 'Saves ~$3,000-$5,000 annually in gas, vehicle wear, parking, and work lunches', importance: 4, category: 'Financial', explanation: 'Direct operational savings narrow the effective pay gap between offers.' },
            { id: 'p3', text: 'Uninterrupted environment for uninterrupted deep work & flexible schedule', importance: 4, category: 'Personal', explanation: 'Fewer office drop-ins and informal interruptions.' }
          ],
          cons: [
            { id: 'c1', text: 'Lower base salary ($15% distinction)', severity: 4, category: 'Financial', explanation: 'Lower starting base can impact future compounding raise percentages.' },
            { id: 'c2', text: 'Fewer organic networking opportunities with executive leadership', severity: 3, category: 'Career', explanation: 'Proximity bias in traditional companies can favor in-office employees for promotions.' },
            { id: 'c3', text: 'Risk of blurred boundaries between home and work life', severity: 3, category: 'Health', explanation: 'Requires self-discipline to unplug at the end of the day.' }
          ],
          swot: {
            strengths: ['Total time autonomy', 'Geographic flexibility', 'Cost savings on commute'],
            weaknesses: ['Less spontaneous networking', 'Requires high self-motivation', 'Potential isolation'],
            opportunities: ['Side projects or personal wellness', 'Work from anywhere', 'Higher daily productivity'],
            threats: ['Management out-of-sight bias', 'Unclear promotion criteria', 'Overworking due to home workspace']
          }
        },
        {
          id: 'opt-office',
          name: 'In-Office Job (+15% Pay)',
          tagline: 'Higher immediate income, face-to-face mentorship, distinct work-home separation',
          pros: [
            { id: 'p1', text: '15% higher compensation boosting lifetime earning baseline', importance: 5, category: 'Financial', explanation: 'Higher starting salary sets higher bar for future bonus and job jumps.' },
            { id: 'p2', text: 'In-person relationship building and spontaneous collaboration', importance: 4, category: 'Career', explanation: 'Hallway conversations accelerate trust with senior stakeholders.' },
            { id: 'p3', text: 'Physical boundary between office work and home relaxation', importance: 3, category: 'Lifestyle', explanation: 'Leaving the office creates a clear mental transition at end of day.' }
          ],
          cons: [
            { id: 'c1', text: '45-minute daily commute each way (1.5 hours/day lost in traffic)', severity: 5, category: 'Lifestyle', explanation: 'Commute stress directly impacts daily energy and leisure time.' },
            { id: 'c2', text: 'Higher daily expenses for fuel, wardrobe, and eating out', severity: 4, category: 'Financial', explanation: 'Subsumes roughly 3-5% of the gross 15% salary increase.' },
            { id: 'c3', text: 'Less schedule autonomy for personal appointments and family duties', severity: 4, category: 'Personal', explanation: 'Must adhere to rigid core office presence hours.' }
          ],
          swot: {
            strengths: ['Immediate higher cash flow', 'In-person team camaraderie', 'Stronger executive visibility'],
            weaknesses: ['Commute tax on personal time', 'Inflexible daily hours', 'Higher daily living expenses'],
            opportunities: ['Accelerated promotion path', 'Direct mentorship', 'Structured office equipment'],
            threats: ['Commute burnout', 'Office distraction culture', 'Restricted location mobility']
          }
        }
      ],
      comparisonCriteria: [
        {
          key: 'net-comp',
          name: 'Effective Net Financial Value',
          description: 'Base pay minus commute expenses, clothes, and lost time value.',
          defaultWeight: 4,
          scores: [
            { optionId: 'opt-remote', score: 8, reasoning: 'Once commute savings and tax benefits are factored in, real compensation gap is under 6%.' },
            { optionId: 'opt-office', score: 8, reasoning: 'Higher gross salary provides higher 401(k) match and baseline for future raises.' }
          ]
        },
        {
          key: 'time-freedom',
          name: 'Personal Time Freedom',
          description: 'Available hours for family, exercise, hobbies, and rest.',
          defaultWeight: 5,
          scores: [
            { optionId: 'opt-remote', score: 10, reasoning: 'Gains 1.5 hours every day back directly into personal life.' },
            { optionId: 'opt-office', score: 4, reasoning: 'Commute eats 360 hours per year of non-renewable time.' }
          ]
        },
        {
          key: 'career-growth',
          name: 'Executive Visibility & Mentorship',
          description: 'Ease of building trust and getting promoted.',
          defaultWeight: 3,
          scores: [
            { optionId: 'opt-remote', score: 6, reasoning: 'Requires intentional communication to stay visible to executive team.' },
            { optionId: 'opt-office', score: 9, reasoning: 'Physical presence makes organic networking and mentorship effortless.' }
          ]
        }
      ],
      verdict: {
        winnerOptionId: 'opt-remote',
        winnerName: 'Fully Remote Job',
        confidencePercentage: 88,
        headline: 'The Fully Remote offer wins cleanly when accounting for the true value of 360 reclaimed commute hours.',
        detailedRecommendation: 'A 15% salary increase sounds significant, but when you factor in 360 annual commute hours plus $4,000 in fuel and maintenance, your "hourly wage" on the in-office role is virtually identical. Unless you urgently need the immediate cash flow or thrive on in-person office culture, the Remote role offers superior overall quality of life.',
        whenToChooseOthers: [
          { optionId: 'opt-office', condition: 'If you are early in your career where in-person executive mentorship is critical, or if you struggle with working isolated at home.' }
        ],
        blindSpots: [
          'Calculating true hourly pay: Divide total annual salary by (2,000 working hours + commute hours). The 15% premium vanishes.',
          'Remote career progression requires proactive asynchronous communication to avoid feeling invisible.',
          'In-office roles often have hidden expenses like business casual wardrobe and frequent coffee/lunch runs.'
        ],
        diagnosticQuestions: [
          'If you convert your 1.5-hour daily commute into an hourly rate, does the 15% salary bump actually compensate you for that time?',
          'Do you feel energized or drained after spending an entire day in an open office environment?',
          'Is your current home setup conducive to quiet, focused 8-hour workdays?'
        ]
      }
    }
  },
  {
    id: 'ev-vs-hybrid',
    title: 'Electric Vehicle (EV) vs. Hybrid Car',
    description: 'Compare charging infrastructure, gas savings, resale value, and road trip convenience.',
    category: 'Tech & Money',
    prompt: 'Should my next car be a fully electric EV (e.g. Tesla Model Y / Hyundai Ioniq 5) or a Plug-in Hybrid (e.g. Prius Prime / RAV4 Prime)?',
    options: ['Fully Electric (EV)', 'Plug-in Hybrid (PHEV)'],
    context: 'Daily commute is 30 miles round trip. Live in a single-family house with garage for Level 2 home charger installation. Take 3-4 long road trips per year.',
    sampleAnalysis: {
      title: 'Fully Electric Vehicle (EV) vs. Plug-in Hybrid (PHEV)',
      summary: 'A breakdown of pure electric driving efficiency versus hybrid dual-fuel range peace of mind.',
      options: [
        {
          id: 'opt-ev',
          name: 'Fully Electric (EV)',
          tagline: 'Zero gas expenses, instant torque acceleration, ultra-low routine maintenance',
          pros: [
            { id: 'p1', text: 'Over 80% reduction in daily fuel cost charging overnight at home', importance: 5, category: 'Financial', explanation: 'Electricity costs ~$0.04/mile vs gas at $0.15/mile.' },
            { id: 'p2', text: 'Zero oil changes, spark plugs, timing belts, or emissions checks', importance: 4, category: 'Effort', explanation: 'Fewer moving parts means lower routine maintenance costs over 100k miles.' },
            { id: 'p3', text: 'Smooth, silent, and instantaneous electric motor torque response', importance: 4, category: 'Lifestyle', explanation: 'Exceptional driving responsiveness and low cabin noise level.' }
          ],
          cons: [
            { id: 'c1', text: 'Requires fast-charger planning and stop delays on long road trips', severity: 4, category: 'Lifestyle', explanation: 'Charging stops take 20-35 mins compared to 5 mins for gas refueling.' },
            { id: 'c2', text: 'Higher upfront purchase price and potential rapid battery technology deprecation', severity: 3, category: 'Financial', explanation: 'EV resale values fluctuate as new battery tech emerges.' },
            { id: 'c3', text: 'Cold weather winter range degradation of 20-30%', severity: 3, category: 'Performance', explanation: 'Battery chemistry loses efficiency in freezing sub-zero temperatures.' }
          ],
          swot: {
            strengths: ['Home garage convenience', 'Lowest operating cost per mile', 'Superior performance'],
            weaknesses: ['Road trip stop times', 'High upfront purchase price', 'Cold weather range loss'],
            opportunities: ['Federal & state EV tax credits', 'Solar panel charging integration', 'Zero tailpipe emissions'],
            threats: ['Public charging station congestion', 'High out-of-warranty battery replacement cost', 'Changing tax incentives']
          }
        },
        {
          id: 'opt-phev',
          name: 'Plug-in Hybrid (PHEV)',
          tagline: 'Electric commute for daily drives + unlimited gas range for long road trips',
          pros: [
            { id: 'p1', text: '35-45 miles of pure electric range covers 100% of daily commute', importance: 5, category: 'Financial', explanation: 'Runs as a pure EV for everyday errands while backed by a gas engine.' },
            { id: 'p2', text: 'Zero range anxiety on cross-country road trips', importance: 5, category: 'Lifestyle', explanation: 'Fills up at any standard gas station in 3 minutes anywhere in the country.' },
            { id: 'p3', text: 'Lower entry purchase price than comparable long-range EVs', importance: 4, category: 'Financial', explanation: 'Smaller battery keeps initial vehicle acquisition cost lower.' }
          ],
          cons: [
            { id: 'c1', text: 'Dual powertrain requires both battery AND internal combustion maintenance', severity: 4, category: 'Effort', explanation: 'Still requires oil changes, air filters, and engine maintenance.' },
            { id: 'c2', text: 'Lower electric acceleration performance when battery depletes', severity: 3, category: 'Performance', explanation: 'Smaller electric motor offers less sportiness than a dedicated EV platform.' },
            { id: 'c3', text: 'Must charge daily due to smaller 35-mile battery capacity', severity: 3, category: 'Lifestyle', explanation: 'Requires plugging in every single night to maximize gas savings.' }
          ],
          swot: {
            strengths: ['Best of both worlds', 'Zero road trip friction', 'Excellent fuel economy'],
            weaknesses: ['Complex dual engine maintenance', 'Smaller electric range', 'Less cargo space due to battery'],
            opportunities: ['Bridge technology for current charging infrastructure', 'Resilient in power outages', 'Versatile family vehicle'],
            threats: ['Rising gas prices for long trips', 'Engine maintenance complexity', 'Slower charging speed']
          }
        }
      ],
      comparisonCriteria: [
        {
          key: 'daily-cost',
          name: 'Daily Commute Cost',
          description: 'Cost to power your 30-mile daily drive.',
          defaultWeight: 5,
          scores: [
            { optionId: 'opt-ev', score: 10, reasoning: 'Cheapest per mile when charged on off-peak home rates.' },
            { optionId: 'opt-phev', score: 9, reasoning: 'Covers 30 miles on electric charge, nearly matching full EV in daily city use.' }
          ]
        },
        {
          key: 'road-trips',
          name: 'Long Road Trip Convenience',
          description: 'Refueling speed and route planning flexibility on 400+ mile trips.',
          defaultWeight: 4,
          scores: [
            { optionId: 'opt-ev', score: 6, reasoning: 'Requires route planning and 30-minute charging stops every 200 miles.' },
            { optionId: 'opt-phev', score: 10, reasoning: 'Gas engine seamlessly takes over for instant 3-minute fill-ups anywhere.' }
          ]
        },
        {
          key: 'maintenance',
          name: 'Routine Maintenance Simplicity',
          description: 'Frequency and cost of oil changes, tune-ups, and service visits.',
          defaultWeight: 4,
          scores: [
            { optionId: 'opt-ev', score: 9, reasoning: 'No engine oil, spark plugs, or exhaust systems to maintain.' },
            { optionId: 'opt-phev', score: 5, reasoning: 'Requires standard internal combustion maintenance plus battery care.' }
          ]
        }
      ],
      verdict: {
        winnerOptionId: 'opt-ev',
        winnerName: 'Fully Electric (EV)',
        confidencePercentage: 85,
        headline: 'Because you have a dedicated home garage for overnight Level 2 charging, a Full EV is the clear winner.',
        detailedRecommendation: 'Since you own a single-family house with a garage and drive 30 miles daily, you are in the ideal 1% use-case for a full EV. Waking up every morning with a "full tank" of cheap electricity eliminates 95% of gas station visits, and modern fast-charging networks comfortably handle 3-4 annual road trips.',
        whenToChooseOthers: [
          { optionId: 'opt-phev', condition: 'If you frequently drive to remote rural regions without fast chargers, or if you regularly tow heavy loads long distances.' }
        ],
        blindSpots: [
          'Installing a Level 2 240V garage outlet usually costs $500-$1,500 depending on your electrical breaker panel capacity.',
          'Public fast-charging prices ($0.40-$0.50/kWh) can cost as much as gas if you rely heavily on public stations on road trips.',
          'Tires wear out 20% faster on EVs due to instant torque and heavier battery weight.'
        ],
        diagnosticQuestions: [
          'Is your home electrical panel equipped to support a dedicated 40-amp 240V breaker for home charging?',
          'Are your 3-4 annual road trips along major highway corridors equipped with DC Fast Chargers (e.g. Tesla Superchargers / Electrify America)?',
          'Do you mind adding 25 minutes of relaxation/snack time to every 3 hours of highway driving on long trips?'
        ]
      }
    }
  }
];
