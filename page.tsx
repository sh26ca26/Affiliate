'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="border-b border-slate-700/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center font-bold">
              AS
            </div>
            <span className="text-xl font-bold">Affiliate SaaS</span>
          </div>
          <div className="flex gap-4 rtl:gap-4">
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg text-slate-300 hover:text-white transition-colors"
            >
              تسجيل الدخول
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
            >
              إنشاء حساب
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            منصة التسويق بالعمولة الشاملة
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            إدارة برامج الإحالة والعمولات بسهولة. تتبع النقرات والتحويلات والأرباح في لوحة تحكم واحدة
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/register?role=merchant"
              className="px-8 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
            >
              ابدأ كتاجر
            </Link>
            <Link
              href="/register?role=affiliate"
              className="px-8 py-3 rounded-lg border border-primary text-primary font-semibold hover:bg-primary/10 transition-colors"
            >
              ابدأ كشريك تسويقي
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'تتبع فعال',
              description: 'تتبع كل نقرة وتحويل بدقة عالية مع تقارير مفصلة',
              icon: '📊',
            },
            {
              title: 'إدارة العمولات',
              description: 'حساب وإدارة العمولات تلقائياً مع مرونة كاملة',
              icon: '💰',
            },
            {
              title: 'مدفوعات آمنة',
              description: 'معالجة آمنة للمدفوعات مع دعم طرق دفع متعددة',
              icon: '🔒',
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="p-6 rounded-lg border border-slate-700 bg-slate-800/50 backdrop-blur hover:border-primary transition-colors"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">جاهز للبدء؟</h2>
        <p className="text-slate-300 mb-8">انضم إلى آلاف التجار والشركاء الذين يستخدمون Affiliate SaaS</p>
        <Link
          href="/register"
          className="inline-block px-8 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
        >
          إنشاء حساب مجاني الآن
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400">
          <p>&copy; 2024 Affiliate SaaS. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}

