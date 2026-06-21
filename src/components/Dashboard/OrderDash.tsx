"use client"
import React, { useState, useTransition } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { CheckCircle, Eye, RotateCcw, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { deleteOrderPermanently, moveOrderToDone, moveOrderToWaiting } from '@/Action/Orders' 
import { DashboardOrder } from '@/Types/DashboardOrder' 
import Loader2 from '../Loader2/Loader2'



interface DashOrderProps {
  doneOrders: DashboardOrder[];
  waitingOrders: DashboardOrder[];
}

export default function OrderDash({ waitingOrders, doneOrders }: DashOrderProps) {
  const [waiting, setWaiting] = useState<DashboardOrder[]>(waitingOrders || []);
  const [done, setDone] = useState<DashboardOrder[]>(doneOrders || []);
  
  const [selectedOrder, setSelectedOrder] = useState<DashboardOrder | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  const handleMoveToDone = (order: DashboardOrder) => {
    setWaiting(prev => prev.filter(o => o.id !== order.id));
    setDone(prev => [order, ...prev]);

    startTransition(async () => {
      const res = await moveOrderToDone(order); 
      if (!res.success) {
        toast.error("حدث خطأ أثناء نقل الطلب");
        setDone(prev => prev.filter(o => o.id !== order.id));
        setWaiting(prev => [order, ...prev]);
        console.log("Error moving order to done:", res.error);
      } else {
        toast.success("تم نقل الطلب إلى قائمة المسلّمة");
      }
    });
  };

  const handleMoveToWaiting = (order: DashboardOrder) => {
    setDone(prev => prev.filter(o => o.id !== order.id));
    setWaiting(prev => [order, ...prev]);

    startTransition(async () => {
      const res = await moveOrderToWaiting(order);
      if (!res.success) {
        toast.error("حدث خطأ أثناء إرجاع الطلب");
        setWaiting(prev => prev.filter(o => o.id !== order.id));
        setDone(prev => [order, ...prev]);
        console.log("Error moving order to waiting:", res.error);
      } else {
        toast.success("تم إرجاع الطلب إلى قيد الانتظار");
      }
    });
  };

  const handleDelete = (orderId: string | undefined, isWaiting: boolean) => {
    if (!orderId) return;

    const table = isWaiting ? "Orders_Waiting" : "Orders_Done";
    const orderToDelete = isWaiting ? waiting.find(o => o.id === orderId) : done.find(o => o.id === orderId);
    
    if (!orderToDelete) return;

    if (isWaiting) {
      setWaiting(prev => prev.filter(o => o.id !== orderId));
    } else {
      setDone(prev => prev.filter(o => o.id !== orderId));
    }

    startTransition(async () => {
      const res = await deleteOrderPermanently(orderId, table);
      if (!res.success) {
        toast.error("حدث خطأ أثناء مسح الطلب");
        if (isWaiting) setWaiting(prev => [orderToDelete, ...prev]);
        else setDone(prev => [orderToDelete, ...prev]);
      } else {
        toast.success("تم مسح الطلب نهائياً");
      }
    });
  };

  const openDetails = (order: DashboardOrder) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "غير محدد";
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('ar-EG', options);
  };

  return (
    <>
    
    {isPending && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#ffffff33] backdrop-blur-[1px]">
        <div className="scale-130"> 
          <Loader2 />
        </div>
      </div>
      )}
      <div className='container pt-4 w-[90%] mx-auto '>
        
        
        <div className='mb-6'>
          <h3 className='text-center text-[24px] Playpen font-medium pt-5 mb-6'>طلبات قيد الانتظار</h3>
        </div>
        
        
        <div className='relative border border-[#B8C2CC] rounded-2xl shadow-md overflow-hidden mb-12'>
          
       
          

          <Table className={`bg-white Playpen transition-opacity duration-300 ${isPending ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <TableHeader className='bg-[#F0F3F6]'>
              <TableRow>
                <TableHead className="text-center font-bold">الإجراءات</TableHead>
                <TableHead className="text-center font-bold">التفاصيل</TableHead>
                <TableHead className="text-center font-bold">تاريخ الطلب</TableHead>
                <TableHead className="text-center font-bold">الكمية</TableHead>
                <TableHead className="text-center font-bold">رقم التواصل</TableHead>
                <TableHead className="text-center font-bold">المنتج</TableHead>
                <TableHead className="text-center font-bold">اسم العميل</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {waiting.length === 0 ? (
                 <TableRow><TableCell colSpan={7} className="text-center py-6 font-bold text-gray-500">لا توجد طلبات قيد الانتظار</TableCell></TableRow>
              ) : (
                waiting.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="text-center flex justify-center gap-2">
                    <button onClick={() => handleDelete(order.id, true)} className='bg-red-500 text-white p-2 rounded-md hover:bg-red-600 duration-300' title="حذف"><Trash2 size={18} /></button>
                      <button onClick={() => handleMoveToDone(order)} className='bg-black text-white p-2 rounded-md hover:bg-transparent hover:text-black border cursor-pointer border-black duration-300' title="تم التسليم"><CheckCircle size={18} /></button>
                    </TableCell>
                    <TableCell className="text-center">
                      <button onClick={() => openDetails(order)} className='bg-gray-100 border border-gray-300 text-black p-2 rounded-md hover:bg-gray-200 duration-300 flex items-center gap-2 mx-auto'>
                        <Eye size={18} /> عرض
                      </button>
                    </TableCell>
                    <TableCell className="text-center text-sm">{formatDate(order.created_at)}</TableCell>
                    <TableCell className="text-center font-bold">{order.quantity}</TableCell>
                    <TableCell className="text-center">{order.PersonNumber}</TableCell>
                    <TableCell className="text-center truncate max-w-[150px]">{order.ProductName}</TableCell>
                    <TableCell className="text-center font-bold">{order.PersonName}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* ==================== جدول تم التسليم ==================== */}
        <div className='mt-10'>
          <h3 className='text-right text-[20px] Playpen font-medium mb-4 text-gray-700'>: طلبات تم تسليمها</h3>
        </div>
        
        {/* 👈 بنكرر نفس الفكرة في الجدول التاني */}
        <div className='relative border border-[#B8C2CC] rounded-2xl shadow-md overflow-hidden pb-5'>
          
          

          <Table className={`bg-white Playpen transition-opacity duration-300 ${isPending ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <TableHeader className='bg-[#F0F3F6]'>
              <TableRow>
                <TableHead className="text-center font-bold">الإجراءات</TableHead>
                <TableHead className="text-center font-bold">التفاصيل</TableHead>
                <TableHead className="text-center font-bold">تاريخ الطلب</TableHead>
                <TableHead className="text-center font-bold">الكمية</TableHead>
                <TableHead className="text-center font-bold">رقم التواصل</TableHead>
                <TableHead className="text-center font-bold">المنتج</TableHead>
                <TableHead className="text-center font-bold">اسم العميل</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {done.length === 0 ? (
                 <TableRow><TableCell colSpan={7} className="text-center py-6 font-bold text-gray-500">لا توجد طلبات مسلّمة</TableCell></TableRow>
              ) : (
                done.map((order) => (
                  <TableRow key={order.id} className='bg-gray-50'>
                    <TableCell className="text-center flex justify-center gap-2">
                    <button onClick={() => handleDelete(order.id, false)} className='bg-red-500 text-white p-2 rounded-md hover:bg-red-600 duration-300' title="حذف"><Trash2 size={18} /></button>
                      <button onClick={() => handleMoveToWaiting(order)} className='bg-black text-white p-2 rounded-md hover:bg-transparent hover:text-black border cursor-pointer border-black duration-300' title="إرجاع لقيد الانتظار"><RotateCcw size={18} /></button>
                    </TableCell>
                    <TableCell className="text-center">
                      <button onClick={() => openDetails(order)} className='bg-white border border-gray-300 text-black p-2 rounded-md hover:bg-gray-100 duration-300 flex items-center gap-2 mx-auto'>
                        <Eye size={18} /> عرض
                      </button>
                    </TableCell>
                    <TableCell className="text-center text-sm">{formatDate(order.created_at)}</TableCell>
                    <TableCell className="text-center font-bold">{order.quantity}</TableCell>
                    <TableCell className="text-center">{order.PersonNumber}</TableCell>
                    <TableCell className="text-center truncate max-w-[150px]">{order.ProductName}</TableCell>
                    <TableCell className="text-center font-bold">{order.PersonName}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto Playpen !rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold mb-4">تفاصيل الطلب</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="flex flex-col gap-6 text-right">
              
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <h4 className="font-bold text-lg mb-3 border-b pb-2">بيانات العميل</h4>
                <div className="grid grid-cols-2 gap-4 text-[15px]">
              
                  <div><span className="font-bold">رقم الهاتف:</span> {selectedOrder.PersonNumber}</div>
                  <div><span className="font-bold">الاسم:</span> {selectedOrder.PersonName}</div>
                  <div className="col-span-2"><span className="font-bold">العنوان:</span> {selectedOrder.PersonAddress}</div>
                  {selectedOrder.PersonNumber2 && <div><span className="font-bold">رقم بديل:</span> {selectedOrder.PersonNumber2}</div>}
                  {selectedOrder.description && <div className="col-span-2"><span className="font-bold">ملاحظات إضافية:</span> {selectedOrder.description}</div>}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-lg mb-3 text-right">المنتج المطلوب</h4>
                <div className="flex gap-4 p-3 border border-gray-200 rounded-xl items-center bg-white">
                  <div className="flex-1 text-right">
                    <p className="font-bold text-[18px]">{selectedOrder.ProductName}</p>
                    <p className="text-sm text-gray-500 mb-2">سعر القطعة: {selectedOrder.price_per_unit} EGP | الكمية: {selectedOrder.quantity}</p>
                    
                    <div className="flex flex-wrap gap-2 justify-end mt-2">
                      {selectedOrder.Productsdetails?.map((d, i) => (
                        <span key={i} className="bg-gray-100 border border-gray-300 text-[12px] px-3 py-1.5 rounded-md text-black font-medium">
                          مقاس: <span className="font-bold">{d.size || "؟"}</span> | لون: <span className="font-bold text-[#000000]">{d.color || "؟"}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                  <img src={selectedOrder.images?.[0]} alt={selectedOrder.ProductName} className="w-[90px] h-[90px] object-cover rounded-lg border border-gray-200 shadow-sm" />
                </div>
              </div>

              <div className="bg-black text-white p-4 rounded-xl flex justify-between items-center mt-2">
                <span className="font-bold text-xl">{selectedOrder.subtotal} EGP</span>
                <span className="font-bold text-lg">: إجمالي المنتج</span>
              </div>

            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}