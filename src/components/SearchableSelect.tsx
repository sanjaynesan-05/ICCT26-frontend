/**
 * SearchableSelect Component
 * Dropdown with search/filter functionality
 * Features: Type-to-search, keyboard navigation, case-insensitive filtering
 */

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SearchableSelectProps {
  options: string[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  label?: string
  required?: boolean
  className?: string
  disabledOptions?: string[]
  optionCapacities?: Record<string, string>
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  disabled = false,
  label,
  required = false,
  className = '',
  disabledOptions = [],
  optionCapacities = {},
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const optionsListRef = useRef<HTMLDivElement>(null)

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 0)
    }
  }, [isOpen])

  // Scroll highlighted option into view
  useEffect(() => {
    if (optionsListRef.current && isOpen) {
      const highlightedElement = optionsListRef.current.querySelector(
        `[data-index="${highlightedIndex}"]`
      ) as HTMLElement
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        })
      }
    }
  }, [highlightedIndex, isOpen])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        setIsOpen(true)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0))
        break
      case 'Enter':
        e.preventDefault()
        if (filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        setSearchTerm('')
        break
      default:
        break
    }
  }

  const handleSelect = (option: string) => {
    onChange(option)
    setIsOpen(false)
    setSearchTerm('')
    setHighlightedIndex(0)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange('')
    setSearchTerm('')
    setHighlightedIndex(0)
  }

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {label && (
        <label className="block text-sm font-subheading font-semibold text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Main Input */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`relative w-full px-4 py-3 rounded-lg border-2 transition-all cursor-pointer flex items-center justify-between ${
          isOpen
            ? 'border-primary bg-blue-50'
            : 'border-gray-300 bg-white hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}
      >
        <span
          className={`flex-1 text-left ${
            value ? 'text-gray-900 font-medium' : 'text-gray-500'
          }`}
        >
          {value || placeholder}
        </span>

        <div className="flex items-center gap-2 ml-2">
          {value && !disabled && (
            <button
              onClick={handleClear}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title="Clear selection"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border-2 border-primary rounded-lg shadow-xl overflow-hidden"
          >
            {/* Search Input */}
            <div className="p-3 border-b border-gray-200 bg-gray-50 sticky top-0">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search churches..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setHighlightedIndex(0)
                }}
                onKeyDown={handleKeyDown}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
              />
              <p className="text-xs text-gray-500 mt-2">
                {filteredOptions.length} result{filteredOptions.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Options List */}
            <div
              ref={optionsListRef}
              className="max-h-72 overflow-y-auto bg-white"
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => {
                  const isOptionDisabled = disabledOptions.includes(option)
                  return (
                    <motion.button
                      key={option}
                      data-index={index}
                      onClick={() => !isOptionDisabled && handleSelect(option)}
                      onMouseEnter={() => !isOptionDisabled && setHighlightedIndex(index)}
                      disabled={isOptionDisabled}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className={`w-full text-left px-4 py-3 transition-colors text-sm font-medium flex items-center justify-between ${
                        isOptionDisabled
                          ? 'opacity-50 cursor-not-allowed bg-gray-50 text-gray-400 border-l-4 border-red-300'
                          : index === highlightedIndex
                            ? 'bg-primary/10 text-primary border-l-4 border-primary'
                            : value === option
                              ? 'bg-accent/20 text-primary border-l-4 border-accent'
                              : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                      }`}
                      title={isOptionDisabled ? 'This church has reached its team limit (2/2)' : ''}
                    >
                      <span>{option}</span>
                      <span className="flex items-center gap-2">
                        {optionCapacities[option] && (
                          <span className="text-xs font-semibold">{optionCapacities[option]}</span>
                        )}
                        {isOptionDisabled && (
                          <span className="text-red-500 font-bold text-xs">FULL (2/2)</span>
                        )}
                        {!isOptionDisabled && value === option && (
                          <span className="text-primary font-bold">✓</span>
                        )}
                      </span>
                    </motion.button>
                  )
                })
              ) : (
                <div className="px-4 py-8 text-center text-gray-500 text-sm">
                  <p>No churches found matching "{searchTerm}"</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SearchableSelect
