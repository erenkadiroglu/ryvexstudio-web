---
title: "PerSayar taşları telefonda nasıl tanıyor?"
description: "Tek bir ıstaka fotoğrafından 21 taşa: iki aşamalı tanıma, kurallarla düzeltme ve internetsiz çalışma."
date: 2026-11-09
lang: tr
translationKey: persayar-recognition
tags: ["PerSayar", "nasıl yapılır"]
draft: true
---

PerSayar'da ıstakanızın fotoğrafını çektiğinizde fotoğraf hiçbir yere gitmez. Taşları bulan ve okuyan modeller uygulamanın içinde gelir ve doğrudan telefonunuzda çalışır. Bu yüzden internet bağlantısı da gerekmez.

## Önce fotoğraf hazırlanır

Fotoğrafın yönü, telefonun kaydettiği bilgiye göre düzeltilir ve uzun kenarı 1280 piksel olacak şekilde küçültülür. Bu, hem taşları okumaya yetecek kadar ayrıntı bırakır hem de işi hızlı tutar.

## Birinci aşama: taşları bulmak

İlk model fotoğrafın içinde her bir taşın nerede durduğunu bulur. Gerektiğinde fotoğrafa bir de 90 derece döndürülmüş hâliyle bakılır; aynı taş için bulunan üst üste binen kutular tek kutuda birleştirilir.

Fotoğraf uzaktan çekildiyse taşlar küçük kalır. Bu durumda PerSayar taşların bulunduğu bölgeyi kırpar ve aramayı bu yakın görüntüde tekrarlar.

## İkinci aşama: taşı okumak

Bulunan her taş kesilip küçük bir kareye dönüştürülür ve ikinci modele verilir. Bu model taşın sayısını (1'den 13'e ya da sahte okey) ve rengini (kırmızı, mavi, sarı, siyah) ayrı ayrı tahmin eder. İkisi birleştirilerek 53 olası taştan hangisi olduğu bulunur.

## Kurallarla düzeltme

Okey takımında her taştan en fazla iki tane vardır. Modeller bazen iki benzer taşı karıştırabilir; aynı taştan üçüncüsü bulunduysa en az emin olunan tahmin, o taş için en olası ikinci seçeneğe kaydırılır. Böylece oyunda olamayacak bir el ortaya çıkmaz.

## Sonra hesap başlar

Tanınan taşlar ıstakaya dizilir. PerSayar perleri ve çiftleri kurallara göre arar, okeyi ve göstergeyi hesaba katar ve elinizin baraja ulaşıp ulaşmadığını gösterir. Yanlış tanınan bir taş olursa üzerine dokunup düzeltebilir ya da elle taş ekleyebilirsiniz.
