import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Search, Calendar, MapPin, Clock, CreditCard, Receipt, User, Star } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HeaderUser } from "@/components/header-user"
import StarRating from "@/components/ui/star-rating"
import axios from "axios"

// Enhanced Detail Dialog
const HistoryDetailPage = ({ isDetailDialogOpen, setIsDetailDialogOpen, orderDetail, onGiveRating }) => {

  return (
    <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Receipt className="h-5 w-5" />
            <span>Detail Transaksi</span>
          </DialogTitle>
          <DialogDescription>ID Transaksi: {orderDetail?.id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          <div className="space-y-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 mr-2" />
                Nama Pemesan
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border text-sm">{orderDetail?.customer || ""}</div>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 mr-2" />
                Venue & Lapangan
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border text-sm">
                <div className="font-medium">{orderDetail?.venueName}</div>
                <div className="text-gray-600 text-xs mt-1">{orderDetail?.field}</div>
                <div className="text-gray-500 text-xs">{orderDetail?.venueLocation}</div>
              </div>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 mr-2" />
                Tanggal & Waktu
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border text-sm">
                <div>{orderDetail?.date}</div>
                <div className="text-gray-600 text-xs mt-1">
                  <Clock className="h-3 w-3 inline mr-1" />
                  {orderDetail?.session}
                </div>
              </div>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <CreditCard className="h-4 w-4 mr-2" />
                Metode Pembayaran
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border text-sm">{orderDetail?.method || "N/A"}</div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Total Pembayaran</label>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-sm font-bold text-green-800">
                {orderDetail?.totalPrice || ""}
              </div>
            </div>

            {/* Rating Section */}
            {orderDetail?.hasRated ? (
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Star className="h-4 w-4 mr-2" />
                  Rating Anda
                </label>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <StarRating rating={orderDetail.userRating} readOnly size="h-4 w-4" />
                    <span className="text-sm text-blue-700 font-medium">({orderDetail.userRating}/5)</span>
                  </div>
                  {orderDetail.userComment && (
                    <p className="text-sm text-blue-700">{orderDetail.userComment}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="pt-2">
                <Button 
                  onClick={() => onGiveRating(orderDetail)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  size="sm"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Berikan Rating
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Rating Dialog Component
const RatingDialog = ({ isRatingDialogOpen, setIsRatingDialogOpen, selectedTransaction, onSubmitRating }) => {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Mohon berikan rating terlebih dahulu")
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmitRating(selectedTransaction?.fieldId, rating, comment)
      setIsRatingDialogOpen(false)
      setRating(0)
      setComment("")
    } catch (error) {
      console.error("Error submitting rating:", error)
      alert("Gagal mengirim rating. Silakan coba lagi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isRatingDialogOpen} onOpenChange={setIsRatingDialogOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5" />
            <span>Berikan Rating</span>
          </DialogTitle>
          <DialogDescription>
            Bagaimana pengalaman Anda di {selectedTransaction?.venueName}?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">Berikan rating untuk lapangan:</p>
            <div className="font-medium text-gray-800 mb-4">{selectedTransaction?.field}</div>
            <div className="flex justify-center">
              <StarRating 
                rating={rating} 
                onRatingChange={setRating}
                size="h-8 w-8"
              />
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600 mt-2">Rating: {rating}/5</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Komentar (Opsional)
            </label>
            <Textarea
              placeholder="Bagikan pengalaman Anda..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsRatingDialogOpen(false)}>
            Batal
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {isSubmitting ? "Mengirim..." : "Kirim Rating"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Enhanced Transaction History List
const HistoryUserList = () => {
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false)
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [cartItemCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("all")
  const [transactions, setTransactions] = useState([
    {
      id: "TRX-001",
      customer: "Budi Santoso",
      method: "OVO",
      date: "Selasa, 30 Juni 2025",
      session: "11.00 - 12.00",
      totalPrice: "Rp 70.000",
      venueName: "Johar Arena",
      venueLocation: "Johar Baru, Jakarta",
      field: "Lapangan Futsal A",
      fieldId: "6862b1b7ebf2440851f37c46",
      bookingDate: "2025-06-30",
      hasRated: false,
      userRating: 0,
      userComment: ""
    },
    {
      id: "TRX-002",
      customer: "Siti Aminah",
      method: "Bank Transfer",
      date: "Rabu, 1 Juli 2025",
      session: "14.00 - 16.00",
      totalPrice: "Rp 150.000",
      venueName: "Gelora Sports Center",
      venueLocation: "Jakarta Pusat",
      field: "Lapangan Badminton B",
      fieldId: "6862b1b7ebf2440851f37c47",
      bookingDate: "2025-07-01",
      hasRated: true,
      userRating: 4,
      userComment: "Lapangan bagus dan bersih, pelayanan ramah"
    },
    {
      id: "TRX-003",
      customer: "Andi Wijaya",
      method: "Gopay",
      date: "Kamis, 2 Juli 2025",
      session: "09.00 - 10.00",
      totalPrice: "Rp 50.000",
      venueName: "Sport Hall Utama",
      venueLocation: "Jakarta Barat",
      field: "Lapangan 1",
      fieldId: "686687e90219f47bfc4c88ad",
      bookingDate: "2025-07-02",
      hasRated: false,
      userRating: 0,
      userComment: ""
    },
    {
      id: "TRX-004",
      customer: "Maya Sari",
      method: "Dana",
      date: "Jumat, 3 Juli 2025",
      session: "16.00 - 18.00",
      totalPrice: "Rp 120.000",
      venueName: "Arena Sport Complex",
      venueLocation: "Jakarta Selatan",
      field: "Lapangan Futsal A",
      fieldId: "6862b1b7ebf2440851f37c46",
      bookingDate: "2025-07-03",
      hasRated: true,
      userRating: 5,
      userComment: "Sangat puas dengan fasilitas dan kebersihan lapangan!"
    },
  ])
  const handleCartClick = () => {
    console.log("Cart clicked")
  }

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesSearch =
        transaction.venueName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.field.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.customer.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesDate =
        dateFilter === "all" ||
        (dateFilter === "today" && transaction.bookingDate === "2025-07-01") ||
        (dateFilter === "week" && new Date(transaction.bookingDate) >= new Date("2025-06-25")) ||
        (dateFilter === "month" && new Date(transaction.bookingDate) >= new Date("2025-06-01"))

      return matchesSearch && matchesDate
    })
  }, [searchTerm, dateFilter])

  const handleDetailClick = (order) => {
    setSelectedOrderDetail(order)
    setIsDetailDialogOpen(true)
  }

  const handleGiveRating = (transaction) => {
    setSelectedTransaction(transaction)
    setIsDetailDialogOpen(false)
    setIsRatingDialogOpen(true)
  }
  const handleSubmitRating = async (fieldId, rating, comment) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token')
      
      const response = await axios.post(
        'http://localhost:3000/api/v1/reviews',
        {
          field_id: fieldId,
          rating: rating,
          comment: comment
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.data.success) {
        // Update the transaction state to show it has been rated
        setTransactions(prevTransactions => 
          prevTransactions.map(transaction => 
            transaction.fieldId === fieldId 
              ? { 
                  ...transaction, 
                  hasRated: true, 
                  userRating: rating, 
                  userComment: comment 
                }
              : transaction
          )
        )
        
        // Update selected order detail if it's the same transaction
        if (selectedOrderDetail && selectedOrderDetail.fieldId === fieldId) {
          setSelectedOrderDetail(prev => ({
            ...prev,
            hasRated: true,
            userRating: rating,
            userComment: comment
          }))
        }
        
        alert('Rating berhasil dikirim!')
        console.log('Rating submitted successfully:', response.data)
      }
    } catch (error) {
      console.error('Error submitting rating:', error)
      throw error
    }
  }

  return (
    <>
      <HeaderUser cartItemCount={cartItemCount} onCartClick={handleCartClick} />

      <div className="max-w-4xl mx-auto p-6 pt-24">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 mt-6">Riwayat Transaksi</h1>
          <p className="text-gray-600">Kelola dan lihat semua riwayat pemesanan venue Anda</p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg border p-4 mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari venue, lapangan, atau nama..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Date Filter */}
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Periode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Waktu</SelectItem>
                <SelectItem value="today">Hari Ini</SelectItem>
                <SelectItem value="week">Minggu Ini</SelectItem>
                <SelectItem value="month">Bulan Ini</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Transaction Cards */}
        <div className="space-y-4">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border">
              <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada transaksi</h3>
              <p className="text-gray-500">Tidak ditemukan transaksi yang sesuai dengan filter Anda</p>
            </div>
          ) : (            filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-white border rounded-lg p-6 hover:shadow-md transition-all duration-200 hover:border-green-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg text-gray-900">{transaction.venueName}</h3>
                      {transaction.hasRated && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-300">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Sudah Rating
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        <span>
                          {transaction.field} • {transaction.venueLocation}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{transaction.date}</span>
                      </div>

                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{transaction.session}</span>
                      </div>

                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{transaction.method}</span>
                      </div>
                    </div>

                    {/* Show user rating if available */}
                    {transaction.hasRated && (
                      <div className="mt-3 p-2 bg-blue-50 rounded-md">
                        <div className="flex items-center space-x-2">
                          <StarRating rating={transaction.userRating} readOnly size="h-4 w-4" />
                          <span className="text-sm text-blue-700 font-medium">({transaction.userRating}/5)</span>
                        </div>
                        {transaction.userComment && (
                          <p className="text-sm text-blue-600 mt-1">{transaction.userComment}</p>
                        )}
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xl font-bold text-green-600">{transaction.totalPrice}</span>
                      <span className="text-xs text-gray-500">ID: {transaction.id}</span>
                    </div>
                  </div>

                  <div className="ml-6 flex flex-col space-y-2">
                    <Button
                      onClick={() => handleDetailClick(transaction)}
                      variant="outline"
                      size="sm"
                      className="hover:bg-green-50 hover:border-green-300"
                    >
                      Lihat Detail
                    </Button>
                    
                    {!transaction.hasRated && (
                      <Button
                        onClick={() => handleGiveRating(transaction)}
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        <Star className="h-4 w-4 mr-1" />
                        Beri Rating
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        {filteredTransactions.length > 0 && (
          <div className="mt-8 bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              Menampilkan {filteredTransactions.length} dari {transactions.length} transaksi
            </p>
          </div>
        )}        <HistoryDetailPage
          isDetailDialogOpen={isDetailDialogOpen}
          setIsDetailDialogOpen={setIsDetailDialogOpen}
          orderDetail={selectedOrderDetail}
          onGiveRating={handleGiveRating}
        />

        <RatingDialog
          isRatingDialogOpen={isRatingDialogOpen}
          setIsRatingDialogOpen={setIsRatingDialogOpen}
          selectedTransaction={selectedTransaction}
          onSubmitRating={handleSubmitRating}
        />
      </div>
    </>
  )
}

export default HistoryUserList