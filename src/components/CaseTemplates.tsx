import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Scale, User, Car, Home, Briefcase, Heart, 
  Shield, Globe, BookOpen, Zap, ArrowRight 
} from 'lucide-react';

interface CaseTemplate {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: string;
  template: {
    incidentType: string;
    description: string;
    fields: Array<{
      name: string;
      placeholder: string;
      type: 'text' | 'textarea' | 'select' | 'date';
      options?: string[];
    }>;
  };
}

const caseTemplates: CaseTemplate[] = [
  {
    id: '1',
    title: 'Motor Vehicle Accident',
    description: 'Hit and run, traffic violations, or vehicle damage cases',
    icon: Car,
    category: 'Traffic',
    template: {
      incidentType: 'Motor Vehicle Accident',
      description: 'Vehicle collision resulting in damage or injury',
      fields: [
        { name: 'date', placeholder: 'Date of accident', type: 'date' },
        { name: 'location', placeholder: 'Location of accident', type: 'text' },
        { name: 'vehicleDetails', placeholder: 'Vehicle details (make, model, color)', type: 'text' },
        { name: 'damageDescription', placeholder: 'Description of damage or injuries', type: 'textarea' },
        { name: 'witnesses', placeholder: 'Any witnesses present?', type: 'text' }
      ]
    }
  },
  {
    id: '2',
    title: 'Property Dispute',
    description: 'Landlord-tenant issues, property damage, or boundary disputes',
    icon: Home,
    category: 'Property',
    template: {
      incidentType: 'Property Dispute',
      description: 'Disagreement over property rights or damages',
      fields: [
        { name: 'propertyType', placeholder: 'Type of property', type: 'select', options: ['Residential', 'Commercial', 'Land', 'Vehicle'] },
        { name: 'disputeType', placeholder: 'Nature of dispute', type: 'select', options: ['Rent', 'Damage', 'Boundary', 'Maintenance', 'Other'] },
        { name: 'description', placeholder: 'Detailed description of the dispute', type: 'textarea' },
        { name: 'date', placeholder: 'When did this issue start?', type: 'date' },
        { name: 'location', placeholder: 'Property address or location', type: 'text' }
      ]
    }
  },
  {
    id: '3',
    title: 'Employment Issue',
    description: 'Workplace harassment, wrongful termination, or wage disputes',
    icon: Briefcase,
    category: 'Employment',
    template: {
      incidentType: 'Employment Issue',
      description: 'Workplace-related legal problem',
      fields: [
        { name: 'issueType', placeholder: 'Type of employment issue', type: 'select', options: ['Harassment', 'Wrongful Termination', 'Wage Dispute', 'Discrimination', 'Safety Issue', 'Other'] },
        { name: 'employer', placeholder: 'Employer or company name', type: 'text' },
        { name: 'description', placeholder: 'Detailed description of the issue', type: 'textarea' },
        { name: 'date', placeholder: 'When did this occur?', type: 'date' },
        { name: 'location', placeholder: 'Workplace location', type: 'text' }
      ]
    }
  },
  {
    id: '4',
    title: 'Family Law Issue',
    description: 'Divorce, child custody, or domestic violence cases',
    icon: Heart,
    category: 'Family',
    template: {
      incidentType: 'Family Law Issue',
      description: 'Family-related legal matter',
      fields: [
        { name: 'issueType', placeholder: 'Type of family issue', type: 'select', options: ['Divorce', 'Child Custody', 'Domestic Violence', 'Support', 'Property Division', 'Other'] },
        { name: 'description', placeholder: 'Detailed description of the situation', type: 'textarea' },
        { name: 'date', placeholder: 'When did this issue arise?', type: 'date' },
        { name: 'location', placeholder: 'Location where this occurred', type: 'text' },
        { name: 'involvedParties', placeholder: 'Who else is involved?', type: 'text' }
      ]
    }
  },
  {
    id: '5',
    title: 'Consumer Complaint',
    description: 'Product defects, service issues, or fraud cases',
    icon: Shield,
    category: 'Consumer',
    template: {
      incidentType: 'Consumer Complaint',
      description: 'Issue with product or service',
      fields: [
        { name: 'productService', placeholder: 'Product or service name', type: 'text' },
        { name: 'issueType', placeholder: 'Type of problem', type: 'select', options: ['Defective Product', 'Poor Service', 'Fraud', 'False Advertising', 'Warranty Issue', 'Other'] },
        { name: 'description', placeholder: 'Detailed description of the problem', type: 'textarea' },
        { name: 'date', placeholder: 'When did you discover the issue?', type: 'date' },
        { name: 'location', placeholder: 'Where did this occur?', type: 'text' }
      ]
    }
  },
  {
    id: '6',
    title: 'Cyber Crime',
    description: 'Online fraud, hacking, or digital harassment cases',
    icon: Globe,
    category: 'Cyber',
    template: {
      incidentType: 'Cyber Crime',
      description: 'Digital or online legal issue',
      fields: [
        { name: 'crimeType', placeholder: 'Type of cyber crime', type: 'select', options: ['Online Fraud', 'Hacking', 'Harassment', 'Identity Theft', 'Data Breach', 'Other'] },
        { name: 'description', placeholder: 'Detailed description of what happened', type: 'textarea' },
        { name: 'date', placeholder: 'When did this occur?', type: 'date' },
        { name: 'platform', placeholder: 'Platform or website involved', type: 'text' },
        { name: 'evidence', placeholder: 'Any evidence or screenshots?', type: 'text' }
      ]
    }
  }
];

interface CaseTemplatesProps {
  onSelectTemplate: (template: CaseTemplate) => void;
  onClose: () => void;
}

export const CaseTemplates: React.FC<CaseTemplatesProps> = ({ onSelectTemplate, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['all', ...Array.from(new Set(caseTemplates.map(t => t.category)))];
  
  const filteredTemplates = caseTemplates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="bg-gradient-to-br from-white via-blue-50 to-amber-50 rounded-3xl shadow-2xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-br from-blue-500 to-amber-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl"
          >
            <FileText className="w-10 h-10 text-white" />
          </motion.div>
          
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-amber-700 bg-clip-text text-transparent mb-2"
          >
            Case Templates
          </motion.h2>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-600 max-w-2xl mx-auto"
          >
            Choose from our pre-built case templates to get started quickly. Each template includes relevant fields and guidance for your specific legal situation.
          </motion.p>
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8 space-y-4"
        >
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all bg-white/80"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white/80 text-slate-600 hover:bg-white hover:text-slate-800 border border-slate-200'
                }`}
              >
                {category === 'all' ? 'All Categories' : category}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Templates Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ delay: 0.8 + index * 0.1, type: 'spring', stiffness: 200 }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectTemplate(template)}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50 cursor-pointer transition-all duration-300 hover:shadow-2xl group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <template.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-blue-600 transition-colors">
                      {template.title}
                    </h3>
                    <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                      {template.category}
                    </span>
                  </div>
                </div>
                
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                  {template.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    {template.template.fields.length} fields
                  </span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="text-blue-600 group-hover:text-blue-700 transition-colors"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Close Button */}
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 right-4 w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 transition-colors"
        >
          ✕
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
