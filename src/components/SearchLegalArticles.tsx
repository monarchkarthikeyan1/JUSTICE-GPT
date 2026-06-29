import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, Scale, FileText, X, Filter, ArrowRight } from 'lucide-react';
import { constitutionalArticles } from '../data/constitutionalArticles';

interface SearchResult {
  id: string;
  type: 'article' | 'case';
  title: string;
  description: string;
  number?: string;
  relevance: number;
}

export const SearchLegalArticles: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'articles' | 'cases'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Search through constitutional articles and mock case law
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const results: SearchResult[] = [];
    const queryLower = query.toLowerCase();

    // Search constitutional articles
    if (selectedFilter === 'all' || selectedFilter === 'articles') {
      constitutionalArticles.forEach(article => {
        const relevance = calculateRelevance(queryLower, article.title + ' ' + article.description);
        if (relevance > 0) {
          results.push({
            id: `article-${article.id}`,
            type: 'article',
            title: article.title,
            description: article.description,
            number: article.number,
            relevance
          });
        }
      });
    }

    // Mock case law search
    if (selectedFilter === 'all' || selectedFilter === 'cases') {
      const mockCases = [
        {
          title: 'State of Punjab v. Gurmit Singh (1996)',
          description: 'Landmark case on property rights and constitutional protection',
          relevance: calculateRelevance(queryLower, 'property rights constitutional protection')
        },
        {
          title: 'Kesavananda Bharati v. State of Kerala (1973)',
          description: 'Fundamental case establishing basic structure doctrine of Indian Constitution',
          relevance: calculateRelevance(queryLower, 'basic structure doctrine constitution')
        },
        {
          title: 'Maneka Gandhi v. Union of India (1978)',
          description: 'Expanded the scope of Article 21 - Right to Life and Personal Liberty',
          relevance: calculateRelevance(queryLower, 'right to life personal liberty article 21')
        },
        {
          title: 'Indira Gandhi v. Raj Narain (1975)',
          description: 'Case dealing with electoral laws and constitutional validity',
          relevance: calculateRelevance(queryLower, 'electoral laws constitutional validity')
        }
      ];

      mockCases.forEach((mockCase, index) => {
        if (mockCase.relevance > 0) {
          results.push({
            id: `case-${index}`,
            type: 'case',
            title: mockCase.title,
            description: mockCase.description,
            relevance: mockCase.relevance
          });
        }
      });
    }

    // Sort by relevance
    results.sort((a, b) => b.relevance - a.relevance);
    setSearchResults(results);
    setIsSearching(false);
  };

  const calculateRelevance = (query: string, text: string): number => {
    const textLower = text.toLowerCase();
    let relevance = 0;
    
    // Exact phrase match
    if (textLower.includes(query)) {
      relevance += 10;
    }
    
    // Word matches
    const queryWords = query.split(' ');
    queryWords.forEach(word => {
      if (textLower.includes(word)) {
        relevance += 2;
      }
    });
    
    // Title matches get bonus
    if (textLower.startsWith(query)) {
      relevance += 5;
    }
    
    return relevance;
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedFilter]);

  const handleResultClick = (result: SearchResult) => {
    // In a real app, this would navigate to the detailed view
    console.log('Selected result:', result);
  };

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
        className="bg-gradient-to-br from-white via-blue-50 to-amber-50 rounded-3xl shadow-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
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
            <Search className="w-10 h-10 text-white" />
          </motion.div>
          
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-amber-700 bg-clip-text text-transparent mb-2"
          >
            Search Legal Resources
          </motion.h2>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-600"
          >
            Search through constitutional articles, case law, and legal precedents
          </motion.p>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-slate-400" />
            <input
              type="text"
              placeholder="Search for legal articles, cases, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all bg-white/80 text-lg shadow-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-6 flex items-center justify-center gap-4"
        >
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 border border-slate-200 rounded-xl text-slate-600 hover:bg-white hover:text-slate-800 transition-all"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex gap-2"
            >
              {(['all', 'articles', 'cases'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedFilter === filter
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white/80 text-slate-600 hover:bg-white hover:text-slate-800 border border-slate-200'
                  }`}
                >
                  {filter === 'all' ? 'All' : filter === 'articles' ? 'Articles' : 'Cases'}
                </button>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Search Results */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="space-y-4"
        >
          {isSearching ? (
            <div className="text-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
              />
              <p className="text-slate-600">Searching legal resources...</p>
            </div>
          ) : searchQuery ? (
            searchResults.length > 0 ? (
              <div className="space-y-4">
                <p className="text-center text-slate-600">
                  Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                </p>
                {searchResults.map((result, index) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    onClick={() => handleResultClick(result)}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 cursor-pointer transition-all duration-300 hover:shadow-xl group"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                        result.type === 'article' 
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                          : 'bg-gradient-to-br from-amber-500 to-amber-600'
                      }`}>
                        {result.type === 'article' ? (
                          <BookOpen className="w-6 h-6 text-white" />
                        ) : (
                          <Scale className="w-6 h-6 text-white" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">
                            {result.title}
                          </h3>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            result.type === 'article' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {result.type === 'article' ? 'Article' : 'Case'}
                          </span>
                          {result.number && (
                            <span className="text-slate-500 text-sm font-mono">
                              {result.number}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-slate-600 text-sm leading-relaxed mb-3">
                          {result.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">
                            Relevance: {Math.round(result.relevance * 10)}%
                          </span>
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="text-blue-600 group-hover:text-blue-700 transition-colors"
                          >
                            <ArrowRight className="w-5 h-5" />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No results found</h3>
                <p className="text-slate-600">
                  Try adjusting your search terms or filters
                </p>
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Start your search</h3>
              <p className="text-slate-600">
                Enter keywords to search through legal resources
              </p>
            </div>
          )}
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
