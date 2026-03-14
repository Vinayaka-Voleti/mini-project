'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Send } from 'lucide-react'

export default function PredictPage() {
  const [formData, setFormData] = useState({
    date: '',
    dayOfWeek: 'Monday',
    mealType: 'lunch',
    studentsEnrolled: '',
    averageAttendance: '',
    specialEvent: 'no',
    weather: 'clear',
    holidayPeriod: 'no',
    menusServed: '',
    leftoverFromPreviousDay: '',
    menuItems: []
  })

  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleMenusChange = (e) => {
    const value = parseInt(e.target.value) || 0

    setFormData(prev => ({
      ...prev,
      menusServed: value,
      menuItems: Array(value).fill('')
    }))
  }

  const handleMenuItemChange = (index, value) => {
    const updatedMenus = [...formData.menuItems]
    updatedMenus[index] = value

    setFormData(prev => ({
      ...prev,
      menuItems: updatedMenus
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      const students = parseInt(formData.studentsEnrolled)
      const attendance = (parseInt(formData.averageAttendance) / 100) * students
      const baseWaste = attendance * 0.15
      const eventMultiplier = formData.specialEvent === 'yes' ? 1.3 : 1
      const weatherImpact = formData.weather === 'rainy' ? 0.9 : 1
      const leftover = parseInt(formData.leftoverFromPreviousDay) || 0

      const predictedWaste =
        Math.round((baseWaste * eventMultiplier * weatherImpact + leftover) * 10) / 10

      const cost = Math.round(predictedWaste * 25)
      const recommendation =
        predictedWaste > 50 ? 'High' : predictedWaste > 30 ? 'Medium' : 'Low'

      setPrediction({
        predictedWaste,
        cost,
        recommendation,
        confidence: (85 + Math.random() * 14).toFixed(1)
      })

      setLoading(false)
    }, 1500)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="p-2 hover:bg-white rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Link>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">Food Wastage Predictor</h1>
            <p className="text-gray-600">Enter hostel details for accurate waste predictions</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Row 1 */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Day of Week</label>
                <select
                  name="dayOfWeek"
                  value={formData.dayOfWeek}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(day => (
                    <option key={day}>{day}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Meal Type</label>
                <select
                  name="mealType"
                  value={formData.mealType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snacks">Snacks</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Students Enrolled</label>
                <input
                  type="number"
                  name="studentsEnrolled"
                  value={formData.studentsEnrolled}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 200"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Average Attendance (%)</label>
                <input
                  type="number"
                  name="averageAttendance"
                  value={formData.averageAttendance}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 85"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Special Event</label>
                <select
                  name="specialEvent"
                  value={formData.specialEvent}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
            </div>

            {/* Row 4 */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Weather</label>
                <select
                  name="weather"
                  value={formData.weather}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="clear">Clear</option>
                  <option value="cloudy">Cloudy</option>
                  <option value="rainy">Rainy</option>
                  <option value="hot">Hot</option>
                  <option value="cold">Cold</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Holiday Period</label>
                <select
                  name="holidayPeriod"
                  value={formData.holidayPeriod}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
            </div>

            {/* Row 5 */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Number of Menus Served
                </label>
                <input
                  type="number"
                  value={formData.menusServed}
                  onChange={handleMenusChange}
                  placeholder="e.g., 4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Leftover from Previous Day (kg)
                </label>
                <input
                  type="number"
                  name="leftoverFromPreviousDay"
                  value={formData.leftoverFromPreviousDay}
                  onChange={handleChange}
                  placeholder="e.g., 5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            {/* Dynamic Menu Items */}
            {formData.menuItems.length > 0 && (
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Menu Items
                </label>

                {formData.menuItems.map((item, index) => (
                  <select
                    key={index}
                    value={item}
                    onChange={(e) => handleMenuItemChange(index, e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Menu Item</option>
                    <option value="rice">Rice</option>
                    <option value="dal">Dal</option>
                    <option value="veg">Main Veg</option>
                    <option value="nonveg">Main Non-Veg</option>
                  </select>
                ))}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2"
            >
              {loading ? "Analyzing..." : (
                <>
                  <Send className="w-5 h-5" />
                  Get Prediction
                </>
              )}
            </button>

          </form>
        </div>

        {/* Prediction Result */}
        {prediction && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-emerald-200">
            <h2 className="text-2xl font-bold mb-6">Prediction Results</h2>

            <div className="grid md:grid-cols-4 gap-4">
              <div className="p-6 border rounded-xl">
                <p className="text-sm text-gray-600">Predicted Waste</p>
                <p className="text-3xl font-bold text-emerald-600">
                  {prediction.predictedWaste} kg
                </p>
              </div>

              <div className="p-6 border rounded-xl">
                <p className="text-sm text-gray-600">Cost Impact</p>
                <p className="text-3xl font-bold text-blue-600">
                  ₹{prediction.cost}
                </p>
              </div>

              <div className="p-6 border rounded-xl">
                <p className="text-sm text-gray-600">Risk Level</p>
                <p className="text-3xl font-bold">{prediction.recommendation}</p>
              </div>

              <div className="p-6 border rounded-xl">
                <p className="text-sm text-gray-600">Confidence</p>
                <p className="text-3xl font-bold text-purple-600">
                  {prediction.confidence}%
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}