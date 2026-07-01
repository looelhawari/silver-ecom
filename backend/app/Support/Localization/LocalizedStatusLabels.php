<?php

namespace App\Support\Localization;

final class LocalizedStatusLabels
{
    /** @var array<string, array<string, array{en: string, ar: string}>> */
    private const LABELS = [
        'order' => [
            'pending' => ['en' => 'Pending', 'ar' => 'قيد الانتظار'],
            'awaiting_confirmation' => ['en' => 'Awaiting Confirmation', 'ar' => 'في انتظار التأكيد'],
            'confirmed' => ['en' => 'Confirmed', 'ar' => 'تم التأكيد'],
            'preparing' => ['en' => 'Preparing', 'ar' => 'جاري التجهيز'],
            'ready_to_ship' => ['en' => 'Ready to Ship', 'ar' => 'جاهز للشحن'],
            'shipped' => ['en' => 'Shipped', 'ar' => 'تم الشحن'],
            'delivered' => ['en' => 'Delivered', 'ar' => 'تم التوصيل'],
            'cancelled' => ['en' => 'Cancelled', 'ar' => 'ملغي'],
            'rejected' => ['en' => 'Rejected', 'ar' => 'مرفوض'],
            'refunded' => ['en' => 'Refunded', 'ar' => 'تم رد المبلغ'],
        ],
        'payment' => [
            'unpaid' => ['en' => 'Unpaid', 'ar' => 'غير مدفوع'],
            'awaiting_proof' => ['en' => 'Awaiting Proof', 'ar' => 'في انتظار إثبات الدفع'],
            'proof_uploaded' => ['en' => 'Proof Uploaded', 'ar' => 'تم رفع إثبات الدفع'],
            'under_review' => ['en' => 'Under Review', 'ar' => 'تحت المراجعة'],
            'approved' => ['en' => 'Approved', 'ar' => 'تم القبول'],
            'rejected' => ['en' => 'Rejected', 'ar' => 'مرفوض'],
            'paid' => ['en' => 'Paid', 'ar' => 'مدفوع'],
            'refunded' => ['en' => 'Refunded', 'ar' => 'تم رد المبلغ'],
        ],
        'shipping' => [
            'not_started' => ['en' => 'Not Started', 'ar' => 'لم يبدأ'],
            'preparing' => ['en' => 'Preparing', 'ar' => 'جاري التجهيز'],
            'ready_to_ship' => ['en' => 'Ready to Ship', 'ar' => 'جاهز للشحن'],
            'shipped' => ['en' => 'Shipped', 'ar' => 'تم الشحن'],
            'out_for_delivery' => ['en' => 'Out for Delivery', 'ar' => 'خارج للتوصيل'],
            'delivered' => ['en' => 'Delivered', 'ar' => 'تم التوصيل'],
            'failed' => ['en' => 'Failed', 'ar' => 'فشل التوصيل'],
            'returned' => ['en' => 'Returned', 'ar' => 'مرتجع'],
        ],
        'custom' => [
            'pending' => ['en' => 'Pending', 'ar' => 'قيد الانتظار'],
            'under_review' => ['en' => 'Under Review', 'ar' => 'تحت المراجعة'],
            'more_details_needed' => ['en' => 'More Details Needed', 'ar' => 'مطلوب تفاصيل إضافية'],
            'quoted' => ['en' => 'Quoted', 'ar' => 'تم إرسال عرض السعر'],
            'customer_accepted' => ['en' => 'Customer Accepted', 'ar' => 'العميل وافق'],
            'customer_rejected' => ['en' => 'Customer Rejected', 'ar' => 'العميل رفض'],
            'approved' => ['en' => 'Approved', 'ar' => 'تم القبول'],
            'converted_to_order' => ['en' => 'Converted to Order', 'ar' => 'تم تحويله لطلب'],
            'rejected' => ['en' => 'Rejected', 'ar' => 'مرفوض'],
            'cancelled' => ['en' => 'Cancelled', 'ar' => 'ملغي'],
        ],
    ];

    public static function status(string $group, string $value, string $locale): array
    {
        $labels = self::LABELS[$group][$value] ?? [
            'en' => str($value)->replace('_', ' ')->title()->toString(),
            'ar' => str($value)->replace('_', ' ')->title()->toString(),
        ];

        return [
            'value' => $value,
            'label' => $locale === 'ar-EG' ? $labels['ar'] : $labels['en'],
            'label_en' => $labels['en'],
            'label_ar' => $labels['ar'],
        ];
    }
}
