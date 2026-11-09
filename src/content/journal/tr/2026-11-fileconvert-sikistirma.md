---
title: "FileConvert bir PDF'i internete göndermeden nasıl küçültüyor?"
description: "Dosyanız telefonunuzdan çıkmadan, metne dokunmadan ve ne kazandığınızı ölçerek: PDF Sıkıştır'ın içi."
date: 2026-11-09
lang: tr
translationKey: fileconvert-compression
tags: ["FileConvert", "nasıl yapılır"]
draft: true
---

PDF küçültmenin en kolay yolu, dosyayı bir siteye yüklemektir. Ama o dosya bir sözleşme, bir kimlik fotokopisi ya da bir sağlık raporu olabilir. FileConvert'te PDF Sıkıştır bu yüzden tamamen telefonunuzda çalışır; dosyanız hiçbir sunucuya gönderilmez.

## Bir PDF'te yeri ne kaplar?

Metin, yazı tipleri ve çizimler çoğu zaman şaşırtıcı derecede küçüktür. Asıl yer kaplayan görsellerdir: telefonla çekilmiş bir fotoğraf, sayfada küçücük görünse bile dosyanın içinde tam çözünürlüğüyle durur.

FileConvert bu yüzden önce her sayfayı gezer ve her görselin sayfada gerçekte ne kadar büyük çizildiğini bulur. Bir görselin piksel sayısı değil, sayfadaki boyutuyla birlikte verdiği keskinlik önemlidir.

## Üç seviye

- **Hafif:** Görsellere hiç dokunulmaz. Yalnızca kayıpsız iyileştirmeler yapılır.
- **Dengeli:** Sayfadaki boyutuna göre 150 DPI'dan keskin görseller bu çözünürlüğe indirilir ve %75 kaliteyle yeniden kodlanır.
- **Güçlü:** Aynı işlem 110 DPI ve %60 kaliteyle yapılır.

Hedefin yalnızca biraz üstündeki bir görsel olduğu gibi bırakılır; çünkü onu yeniden kodlamanın kaybı, kazancından büyüktür. Yeni hâli eskisinden küçük değilse de eskisi korunur.

## Her seviyede yapılanlar

Aynı görsel bir belgede birkaç kez kullanılmışsa tek bir kopyada birleştirilir. Sıkıştırılmamış veri akışları kayıpsız olarak sıkıştırılır ve kullanılmayan nesneler kayıtta yazılmaz.

Metne, yazı tiplerine, çizimlere, bağlantılara ve yer işaretlerine dokunulmaz. Sıkıştırılmış belgedeki metin seçilebilir ve aranabilir kalır.

## Hiçbir şey sessizce atlanmaz

Bazı görsel türleri (örneğin JBIG2, JPEG 2000 ya da baskı için hazırlanmış CMYK görseller) telefonda güvenle yeniden kodlanamaz. FileConvert bu görselleri olduğu gibi bırakır ve sonuç ekranında kaç tane olduğunu söyler. Görsel kaybolmaz, yalnızca küçülmez.

Çıktı önce geçici bir dosyaya yazılır; iş başarıyla biterse yerine taşınır. İşi istediğiniz an iptal edebilirsiniz.

## Sonuç ekranı ölçer, tahmin etmez

Sonuçta gördüğünüz her sayı ölçümdür: önceki boyut, sonraki boyut ve aradaki fark. Örneğin dört sayfalık bir ürün kataloğu 3,3 MB'tan 164 KB'a indi. Bir dosya küçülmediyse FileConvert bunu da açıkça söyler.
