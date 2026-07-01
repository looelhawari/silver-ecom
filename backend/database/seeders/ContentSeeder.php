<?php

namespace Database\Seeders;

use App\Modules\Content\Models\Banner;
use App\Modules\Content\Models\Faq;
use App\Modules\Content\Models\Page;
use Illuminate\Database\Seeder;

class ContentSeeder extends Seeder
{
    public function run(): void
    {
        $pages = [
            ['slug' => 'about', 'title' => 'About Fidda Silver', 'body' => "Fidda Silver is an Egyptian silver atelier offering Egyptian, Italian, Turkish and local 925 sterling silver — rings, bracelets, necklaces, chains and bespoke pieces crafted to order. Every piece is hallmarked and finished by hand."],
            ['slug' => 'privacy-policy', 'title' => 'Privacy Policy', 'body' => "We collect only the information needed to process and deliver your order (name, phone, address, and order details). We never sell your data. Contact us to access or delete your information."],
            ['slug' => 'terms', 'title' => 'Terms & Conditions', 'body' => "Orders are confirmed after we verify availability and payment. Custom orders follow the quoted price and timeline. Prices are in EGP and may change. By ordering you agree to these terms."],
            ['slug' => 'returns-policy', 'title' => 'Returns & Exchange Policy', 'body' => "Ready-made pieces may be exchanged within 14 days in original condition with proof of purchase. Custom-made pieces are non-refundable unless they arrive damaged or not as agreed."],
            ['slug' => 'silver-care', 'title' => 'Silver Care Guide', 'body' => "Keep silver dry and away from perfume and chlorine. Store each piece in a sealed pouch. Polish gently with a soft silver cloth to restore shine."],
        ];

        foreach ($pages as $page) {
            Page::updateOrCreate(
                ['slug' => $page['slug']],
                [...$page, 'seo_title' => $page['title'], 'is_published' => true],
            );
        }

        $faqs = [
            ['group' => 'silver', 'question' => 'What types of silver do you offer?', 'answer' => 'Egyptian, Italian, Turkish and local 925 sterling silver, plus custom-made pieces.'],
            ['group' => 'delivery', 'question' => 'How long does delivery take?', 'answer' => 'Ready-made orders ship within 1–3 business days across Egypt with tracking.'],
            ['group' => 'payment', 'question' => 'Which payment methods are available?', 'answer' => 'Cash on delivery, Vodafone Cash, InstaPay, and bank transfer.'],
            ['group' => 'custom', 'question' => 'How do custom orders work?', 'answer' => 'Upload a reference image and details; we send a quote. Once you approve it, we craft your piece.'],
            ['group' => 'returns', 'question' => 'Can I exchange a piece?', 'answer' => 'Yes, ready-made pieces within 14 days in original condition. Custom pieces are non-refundable unless faulty.'],
            ['group' => 'care', 'question' => 'How do I care for my silver?', 'answer' => 'Keep it dry, store it sealed, and polish with a soft silver cloth.'],
        ];

        foreach ($faqs as $i => $faq) {
            Faq::updateOrCreate(
                ['question' => $faq['question']],
                [...$faq, 'sort_order' => $i, 'is_active' => true],
            );
        }

        Banner::updateOrCreate(
            ['placement' => 'home_hero', 'title' => 'Handcrafted silver, made to be kept'],
            [
                'subtitle' => 'Egyptian, Italian & Turkish silver — and bespoke pieces made for you.',
                'image_path' => 'banners/home-hero.jpg',
                'link_url' => '/shop',
                'is_active' => true,
                'sort_order' => 0,
            ],
        );
    }
}
