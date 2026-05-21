import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, Clock, ArrowRight } from "lucide-react";
import { T } from "@/components/shared/t";

interface Props {
  params: Promise<{ slug: string }>;
}

const HISTORY_ARTICLES: Record<
  string,
  { title: string; period: string; category: string; sections: { heading?: string; text: string }[] }
> = {
  "abu-bakar-ash-shiddiq": {
    title: "Abu Bakar Ash-Shiddiq RA",
    period: "573 – 634 M",
    category: "Khulafaur Rasyidin",
    sections: [
      {
        heading: "Sahabat Terdekat Rasulullah",
        text: "Abu Bakar Ash-Shiddiq RA adalah sahabat terdekat dan khalifah pertama Nabi Muhammad SAW. Beliau lahir pada tahun 573 M di Makkah dan merupakan salah satu orang pertama yang masuk Islam di kalangan orang dewasa. Persahabatannya dengan Rasulullah adalah yang paling erat, bahkan keduanya menikahkan keluarga masing-masing.",
      },
      {
        heading: "Gelar Ash-Shiddiq",
        text: "Gelar \"Ash-Shiddiq\" (yang sangat membenarkan) diberikan kepadanya karena kepercayaannya yang teguh dan tak tergoyahkan, terutama ketika ia segera membenarkan peristiwa Isra Mi'raj Nabi Muhammad SAW tanpa keraguan sedikit pun di saat banyak orang lain meragukannya.",
      },
      {
        heading: "Khalifah Pertama Islam",
        text: "Setelah wafatnya Rasulullah SAW pada tahun 632 M, Abu Bakar terpilih sebagai khalifah pertama melalui musyawarah para sahabat. Selama kepemimpinannya (632–634 M), beliau berhasil menjaga persatuan umat Islam, mengatasi gerakan murtad (Riddah Wars), dan memperluas wilayah Islam.",
      },
      {
        heading: "Pengumpulan Al-Quran",
        text: "Salah satu pencapaian terbesar Abu Bakar adalah mengumpulkan Al-Quran dalam satu mushaf atas saran Umar bin Khattab, setelah banyak hafiz Al-Quran yang gugur dalam Perang Yamamah. Ini adalah langkah bersejarah yang menjaga kelestarian firman Allah hingga hari ini.",
      },
      {
        text: "Abu Bakar wafat pada usia 61 tahun dan dimakamkan berdampingan dengan makam Rasulullah SAW. Beliau dikenang sebagai sosok yang lembut, dermawan, dan sangat mencintai Rasulullah SAW. Rasulullah bersabda: \"Tidak ada seorang pun yang lebih banyak memberikan kebaikan kepadaku dengan jiwanya dan hartanya melebihi Abu Bakar.\"",
      },
    ],
  },
  "umar-bin-khattab": {
    title: "Umar bin Khattab RA",
    period: "584 – 644 M",
    category: "Khulafaur Rasyidin",
    sections: [
      {
        heading: "Al-Faruq — Sang Pembeda",
        text: "Umar bin Khattab RA adalah khalifah kedua yang dikenal sebagai pemimpin yang adil dan tegas. Gelar \"Al-Faruq\" (pembeda antara kebenaran dan kebatilan) diberikan oleh Rasulullah SAW kepadanya. Sebelum masuk Islam, Umar adalah salah satu musuh Islam yang paling ditakuti — namun keislamannya justru memberikan kekuatan besar bagi kaum Muslim.",
      },
      {
        heading: "Ekspansi Wilayah Islam",
        text: "Selama kepemimpinannya (634–644 M), wilayah Islam berkembang pesat meliputi Persia, Mesir, Suriah, dan Palestina. Umar memimpin ekspansi ini dengan kebijaksanaan, selalu memastikan perlakuan adil bagi penduduk wilayah yang ditaklukkan, termasuk menjamin kebebasan beragama.",
      },
      {
        heading: "Pemimpin yang Merakyat",
        text: "Umar dikenal sebagai pemimpin yang sangat memperhatikan kesejahteraan rakyatnya. Beliau sering berkeliling di malam hari secara menyamar untuk memastikan tidak ada rakyatnya yang kelaparan atau menderita. Ia pernah memanggul karung gandum sendiri untuk diberikan kepada seorang ibu dan anaknya yang kelaparan.",
      },
      {
        heading: "Warisan Sistem Pemerintahan",
        text: "Umar meletakkan dasar sistem pemerintahan Islam yang terorganisir: pembentukan Baitul Mal (kas negara), sistem kalender Hijriah, administrasi wilayah dengan gubernur, dan sistem gaji bagi tentara. Pembukaan Baitul Maqdis (Yerusalem) di bawah kepemimpinannya juga menjadi salah satu momen bersejarah.",
      },
      {
        text: "Umar wafat pada tahun 644 M akibat ditikam oleh seorang budak bernama Abu Lu'lu'ah. Beliau dimakamkan berdampingan dengan Rasulullah SAW dan Abu Bakar. Rasulullah SAW pernah bersabda: \"Seandainya ada nabi setelahku, niscaya itu adalah Umar bin Khattab.\"",
      },
    ],
  },
  "utsman-bin-affan": {
    title: "Utsman bin Affan RA",
    period: "579 – 656 M",
    category: "Khulafaur Rasyidin",
    sections: [
      {
        heading: "Dzun Nurain — Pemilik Dua Cahaya",
        text: "Utsman bin Affan RA adalah khalifah ketiga Islam yang mendapat julukan \"Dzun Nurain\" (pemilik dua cahaya) karena menikahi dua putri Rasulullah SAW secara berurutan: Ruqayyah, dan setelah wafatnya menikahi Ummu Kultsum. Beliau lahir di Thaif pada tahun 579 M dan termasuk golongan pertama yang memeluk Islam.",
      },
      {
        heading: "Dermawan dan Pencinta Ilmu",
        text: "Utsman adalah salah satu sahabat terkaya Rasulullah SAW namun sangat dermawan. Ketika kaum Muslim membutuhkan air di Madinah, beliau membeli sumur Raumah dari seorang Yahudi dengan harga mahal dan mewakafkannya untuk seluruh umat. Ia juga membiayai sepenuhnya pasukan Al-'Usrah (Tabuk) yang terkenal mahal.",
      },
      {
        heading: "Standarisasi Mushaf Al-Quran",
        text: "Pencapaian terbesar Utsman dalam sejarah Islam adalah pembakuan mushaf Al-Quran. Pada masanya, Islam telah menyebar ke berbagai wilayah dan muncul perbedaan bacaan yang mengkhawatirkan. Utsman membentuk panitia yang mengkodifikasi mushaf standar — yang dikenal sebagai \"Mushaf Utsmani\" — dan memerintahkan pembakaran naskah-naskah yang berbeda.",
      },
      {
        heading: "Ekspansi dan Cobaan",
        text: "Wilayah Islam terus meluas di bawah pemerintahannya (644–656 M) hingga mencakup Afrika Utara, Armenia, dan Cyprus. Namun di tahun-tahun terakhir, beliau menghadapi fitnah dan pemberontakan yang dipicu oleh keluhan terhadap beberapa kebijakan pemerintahannya. Fitnah ini berujung pada terkepungnya Utsman di rumahnya selama berpekan-pekan.",
      },
      {
        text: "Utsman wafat syahid pada tahun 656 M saat sedang membaca Al-Quran ketika para pemberontak menyerbu kediamannya. Darahnya jatuh tepat di atas mushaf. Rasulullah SAW pernah bersabda bahwa Utsman akan menghadapi cobaan besar, dan beliau menanggungnya dengan penuh kesabaran dan keteguhan iman.",
      },
    ],
  },
  "ali-bin-abi-thalib": {
    title: "Ali bin Abi Thalib RA",
    period: "601 – 661 M",
    category: "Khulafaur Rasyidin",
    sections: [
      {
        heading: "Singa Allah",
        text: "Ali bin Abi Thalib RA adalah sepupu sekaligus menantu Rasulullah SAW, suami Fatimah Az-Zahra, dan ayah Hasan serta Husain. Beliau adalah salah satu orang yang paling awal masuk Islam — bahkan disebut sebagai anak pertama yang memeluk Islam. Julukan \"Asadullah\" (Singa Allah) diberikan karena keberanian dan kecakapannya dalam peperangan.",
      },
      {
        heading: "Pintu Gerbang Ilmu",
        text: "Rasulullah SAW bersabda: \"Aku adalah kota ilmu dan Ali adalah pintunya.\" Ali memang dikenal sebagai salah satu sahabat paling berilmu di bidang fiqh, tafsir Al-Quran, dan retorika. Banyak kalimat hikmah dan pernyataan mendalam yang dinisbatkan kepadanya, dan beliau sangat dihormati baik oleh Sunni maupun Syiah.",
      },
      {
        heading: "Khalifah di Tengah Fitnah",
        text: "Ali menjadi khalifah keempat (656–661 M) dalam kondisi umat yang sudah terpecah pasca terbunuhnya Utsman. Masa pemerintahannya diwarnai oleh konflik internal: Perang Jamal melawan pasukan Aisyah RA dan Perang Shiffin melawan Muawiyah bin Abi Sufyan. Ali selalu berusaha mencegah pertumpahan darah Muslim meski situasi memaksanya berperang.",
      },
      {
        heading: "Keadilan dan Kezuhudan",
        text: "Di tengah kekacauan politik, Ali tetap dikenal sebagai pemimpin yang sangat adil dan zuhud. Beliau hidup sederhana meski memimpin kekhalifahan yang luas, dan tidak mengistimewakan kerabatnya dalam pembagian harta negara. Kesederhanaan ini menjadi teladan yang sering dikutip dalam literatur Islam hingga kini.",
      },
      {
        text: "Ali wafat syahid pada tahun 661 M setelah ditikam oleh Abdurrahman bin Muljam di Masjid Kufah saat hendak melaksanakan shalat Subuh. Sebelum wafat, beliau berpesan agar pembalasan hanya ditujukan kepada pelakunya saja dan tidak berlebihan. Makamnya di Najaf, Irak, menjadi tempat ziarah hingga hari ini.",
      },
    ],
  },

  // ── Dinasti & Kekhalifahan ──────────────────────────────────────────────────

  "dinasti-umayyah": {
    title: "Dinasti Umayyah",
    period: "661 – 750 M",
    category: "Dinasti & Kekhalifahan",
    sections: [
      {
        heading: "Berdirinya Kekhalifahan Umayyah",
        text: "Dinasti Umayyah berdiri setelah Muawiyah bin Abi Sufyan mengambil alih kekhalifahan dari Ali bin Abi Thalib RA pada tahun 661 M — sebuah peristiwa yang mengubah sistem pemerintahan Islam dari syura (musyawarah) menjadi monarki turun-temurun. Ibu kota kekhalifahan dipindahkan dari Madinah ke Damaskus, Syria, yang menjadi pusat kekuasaan selama hampir satu abad.",
      },
      {
        heading: "Ekspansi Terluas dalam Sejarah Islam",
        text: "Di bawah Dinasti Umayyah, wilayah Islam mencapai luasnya yang paling besar sepanjang sejarah. Pasukan Muslim menaklukkan Afrika Utara, Spanyol (Al-Andalus), Asia Tengah hingga perbatasan Tiongkok, dan wilayah India. Pada puncaknya, kekhalifahan Umayyah membentang dari Spanyol di barat hingga Sindh di timur — menjadikannya salah satu imperium terbesar yang pernah ada.",
      },
      {
        heading: "Kemajuan Peradaban",
        text: "Masa Umayyah bukan sekadar ekspansi militer. Khalifah Umar bin Abdul Aziz (Umar II), yang memerintah 717–720 M, dikenal sebagai pemimpin yang adil dan reformis. Pembangunan infrastruktur, jalan raya, irigasi, dan pos-pos kuda dilakukan di seluruh wilayah. Bahasa Arab ditetapkan sebagai bahasa resmi administrasi, mendorong penyebarluasan budaya dan ilmu pengetahuan Islam.",
      },
      {
        heading: "Kejatuhan dan Warisan",
        text: "Dinasti Umayyah berakhir pada tahun 750 M ketika Bani Abbasiyah menggulingkan kekuasaan mereka. Pemberontakan dipicu oleh ketidakpuasan kaum Muslim non-Arab yang merasa diperlakukan sebagai warga kelas dua. Satu-satunya keturunan Umayyah yang lolos, Abdurrahman I, melarikan diri ke Spanyol dan mendirikan Emirat Kordoba — mempertahankan warisan Umayyah di Barat selama berabad-abad.",
      },
    ],
  },

  "dinasti-abbasiyah": {
    title: "Dinasti Abbasiyah",
    period: "750 – 1258 M",
    category: "Dinasti & Kekhalifahan",
    sections: [
      {
        heading: "Revolusi Abbasiyah",
        text: "Dinasti Abbasiyah berdiri setelah revolusi berdarah menggulingkan Bani Umayyah pada tahun 750 M. Kekhalifahan baru ini dinisbatkan kepada Abbas bin Abdul Muthalib, paman Nabi Muhammad SAW. Ibu kota kemudian dipindahkan ke Baghdad yang baru dibangun di tepi Sungai Tigris — sebuah kota bundar yang dirancang sebagai pusat dunia.",
      },
      {
        heading: "Zaman Keemasan Islam",
        text: "Era Abbasiyah, terutama abad ke-8 hingga ke-10, dikenal sebagai Zaman Keemasan Islam (The Golden Age of Islam). Di bawah khalifah seperti Harun al-Rasyid dan Al-Ma'mun, Baghdad menjadi pusat ilmu pengetahuan, filsafat, matematika, astronomi, dan kedokteran dunia. Bayt al-Hikmah (Rumah Kebijaksanaan) didirikan untuk menerjemahkan karya-karya Yunani, Persia, dan India ke dalam bahasa Arab.",
      },
      {
        heading: "Kontribusi Ilmu Pengetahuan",
        text: "Para ilmuwan Muslim di era Abbasiyah memberikan kontribusi yang tak ternilai bagi peradaban manusia. Al-Khawarizmi meletakkan dasar aljabar, Ibnu Sina menulis ensiklopedia kedokteran, Al-Biruni mempelajari geografi dan sejarah, sementara Al-Razi memajukan ilmu kimia dan kedokteran klinis. Banyak kata dalam bahasa Eropa modern yang berasal dari bahasa Arab era ini.",
      },
      {
        heading: "Kehancuran Baghdad",
        text: "Pada tahun 1258 M, tentara Mongol di bawah Hulagu Khan menyerbu dan menghancurkan Baghdad. Khalifah terakhir Abbasiyah, Al-Musta'sim, dibunuh bersama ratusan ribu penduduk kota. Perpustakaan-perpustakaan yang menyimpan warisan intelektual berabad-abad dibakar. Peristiwa ini dianggap sebagai salah satu bencana terbesar dalam sejarah peradaban Islam.",
      },
    ],
  },

  "kekhalifahan-utsmani": {
    title: "Kekhalifahan Utsmani",
    period: "1299 – 1924 M",
    category: "Dinasti & Kekhalifahan",
    sections: [
      {
        heading: "Kebangkitan Turki Utsmani",
        text: "Kekhalifahan Utsmani (Ottoman) didirikan oleh Osman I sekitar tahun 1299 M di Anatolia (Turki modern). Berawal dari sebuah kesultanan kecil, Utsmani terus berkembang melalui serangkaian penaklukan yang brilian. Puncak kejayaannya tercapai ketika Sultan Mehmed II menaklukkan Konstantinopel pada tahun 1453 M — mengakhiri Kekaisaran Romawi Timur yang telah bertahan lebih dari seribu tahun.",
      },
      {
        heading: "Penjaga Dua Tanah Suci",
        text: "Setelah menaklukkan Mesir pada 1517 M dan mengambil alih gelar khalifah, Utsmani menjadi pelindung resmi Makkah dan Madinah. Para sultan Utsmani memegang gelar 'Khadim al-Haramayn' (Pelayan Dua Tanah Suci) dengan penuh kebanggaan. Mereka membangun dan merenovasi Masjidil Haram, Masjid Nabawi, dan berbagai infrastruktur untuk memudahkan para haji.",
      },
      {
        heading: "Warisan Seni dan Arsitektur",
        text: "Kekhalifahan Utsmani meninggalkan warisan arsitektur yang menakjubkan. Masjid Biru (Sultan Ahmed Mosque) di Istanbul, Masjid Süleymaniye, dan ratusan karya arsitektur lainnya masih berdiri megah hingga kini. Seni kaligrafi, miniatur, dan tekstil Utsmani mencapai puncak keindahannya. Hukum, administrasi, dan militer juga dikembangkan ke tingkat yang sangat kompleks.",
      },
      {
        heading: "Runtuhnya Kekhalifahan",
        text: "Setelah Perang Dunia I, Kekhalifahan Utsmani yang berpihak kepada Jerman mengalami kekalahan. Wilayahnya dipotong-potong oleh kekuatan Barat melalui Perjanjian Sèvres. Mustafa Kemal Atatürk kemudian memimpin revolusi yang mengakhiri kekhalifahan secara resmi pada 3 Maret 1924 — menandai berakhirnya institusi kekhalifahan yang telah ada sejak zaman Islam awal.",
      },
    ],
  },

  "islam-di-andalusia": {
    title: "Kejayaan Islam di Andalusia",
    period: "711 – 1492 M",
    category: "Dinasti & Kekhalifahan",
    sections: [
      {
        heading: "Penaklukan Spanyol oleh Thariq bin Ziyad",
        text: "Pada tahun 711 M, panglima Thariq bin Ziyad menyeberangi selat yang kini menyandang namanya (Gibraltar, dari Jabal Thariq) bersama 7.000 pasukan Muslim. Mereka mengalahkan Raja Roderick dari Visigoth dalam Pertempuran Guadalete yang menentukan. Dalam waktu singkat, hampir seluruh Semenanjung Iberia jatuh ke tangan Muslim dan mulailah era gemilang Al-Andalus.",
      },
      {
        heading: "Peradaban Terdepan di Eropa",
        text: "Selama berabad-abad, kota-kota Andalusia seperti Kordoba, Sevilla, Granada, dan Toledo menjadi pusat peradaban paling maju di Eropa. Ketika Eropa barat berada dalam Abad Kegelapan, Kordoba adalah kota dengan jutaan penduduk, jalan-jalan beraspal, lampu jalan, perpustakaan dengan ratusan ribu buku, sekolah-sekolah, dan rumah sakit modern. Kordoba menjadi magnet bagi para pelajar dari seluruh Eropa.",
      },
      {
        heading: "Pusat Ilmu Pengetahuan",
        text: "Andalusia menjadi jembatan transmisi ilmu pengetahuan dari dunia Islam ke Eropa. Karya-karya Ibnu Rushd (Averroes) dalam filsafat, Al-Zahrawi dalam ilmu bedah, Ibnu Tufayl dalam novel filsafat, dan Ibnu Hazm dalam teologi dan sastra — semuanya lahir atau berkembang di Andalusia. Sekolah penerjemahan di Toledo menerjemahkan ratusan karya Arab ke bahasa Latin, memulai Renaisans Eropa.",
      },
      {
        heading: "Reconquista dan Akhir Al-Andalus",
        text: "Selama berabad-abad, kerajaan-kerajaan Kristen di utara Spanyol perlahan merebut kembali wilayah yang telah Islamkan. Proses ini disebut Reconquista. Pada 2 Januari 1492, Sultan Muhammad XII (Boabdil) menyerahkan Granada — benteng terakhir Muslim di Spanyol — kepada Ferdinand dan Isabella dari Castile. Berakhirlah hampir 800 tahun kehadiran Islam di Eropa Barat.",
      },
    ],
  },

  // ── Tokoh & Ulama Islam ────────────────────────────────────────────────────

  "imam-al-ghazali": {
    title: "Imam Al-Ghazali",
    period: "1058 – 1111 M",
    category: "Tokoh & Ulama Islam",
    sections: [
      {
        heading: "Hujjatul Islam — Bukti Islam",
        text: "Abu Hamid Muhammad Al-Ghazali lahir di Tus, Khorasan (Iran modern) pada tahun 1058 M. Kepintarannya yang luar biasa membawanya menjadi profesor di Universitas Nizamiyah Baghdad pada usia 34 tahun — posisi paling bergengsi di dunia akademik Islam saat itu. Gelar 'Hujjatul Islam' (Bukti Islam) diberikan karena kemampuannya membela dan menjelaskan Islam secara rasional maupun spiritual.",
      },
      {
        heading: "Krisis Spiritual dan Transformasi",
        text: "Di puncak karir akademisnya, Al-Ghazali mengalami krisis spiritual yang mendalam. Ia meragukan kemampuan akal semata untuk mencapai kebenaran sejati. Ia meninggalkan jabatan, ketenaran, dan kemewahan untuk menjalani hidup sebagai sufi pengembara selama hampir 10 tahun. Pengalaman transformatif ini melahirkan karya agungnya, Ihya Ulum al-Din.",
      },
      {
        heading: "Ihya Ulum al-Din",
        text: "Ihya Ulum al-Din (Menghidupkan Ilmu-ilmu Agama) adalah mahakarya Al-Ghazali yang terdiri dari 40 buku dalam 4 bagian besar: ibadah, adat kebiasaan, hal-hal yang membinasakan jiwa, dan hal-hal yang menyelamatkan jiwa. Karya ini dianggap sebagai salah satu buku terpenting dalam literatur Islam — sebuah ensiklopedia spiritual yang menyintesiskan fiqh, akhlak, dan tasawuf.",
      },
      {
        heading: "Warisan Abadi",
        text: "Al-Ghazali wafat di Tus pada tahun 1111 M setelah kembali mengajar dan menulis. Karya-karyanya mencakup filsafat, teologi, logika, hukum, dan tasawuf. Kitab Tahafut al-Falasifah (Kerancuan Para Filosof) menunjukkan kemampuannya mengkritisi filsafat Yunani dari sudut pandang Islam. Pengaruhnya terasa hingga hari ini dalam tradisi keilmuan Islam di seluruh dunia.",
      },
    ],
  },

  "ibnu-sina": {
    title: "Ibnu Sina (Avicenna)",
    period: "980 – 1037 M",
    category: "Tokoh & Ulama Islam",
    sections: [
      {
        heading: "Bapak Kedokteran Modern",
        text: "Abu Ali al-Husain ibn Abdullah ibn Sina, dikenal di Barat sebagai Avicenna, lahir di Afshana dekat Bukhara (Uzbekistan modern) pada 980 M. Anak prodigi yang telah menghafal Al-Quran dan menguasai berbagai ilmu pada usia 10 tahun. Pada usia 18 tahun, ia sudah menjadi dokter yang diakui dan berhasil menyembuhkan penyakit yang gagal ditangani dokter-dokter senior.",
      },
      {
        heading: "Al-Qanun fi al-Tibb",
        text: "Karya agung Ibnu Sina, Al-Qanun fi al-Tibb (Canon of Medicine), adalah ensiklopedia medis yang merangkum seluruh pengetahuan kedokteran Yunani, Arab, dan pengalamannya sendiri. Buku setebal lebih dari sejuta kata ini menjadi buku teks utama di universitas-universitas Eropa selama hampir 600 tahun — dari abad ke-12 hingga ke-17. Di dalamnya ia menjelaskan sistem peredaran darah, penyakit menular, dan anatomi tubuh.",
      },
      {
        heading: "Kontribusi di Bidang Lain",
        text: "Selain kedokteran, Ibnu Sina adalah ensiklopedis sejati. Ia menulis lebih dari 450 karya di bidang filsafat, logika, psikologi, astronomi, matematika, musik, dan geologi. Kitab al-Shifa (Book of Healing) adalah ensiklopedia filsafat dan sains terbesar yang pernah ditulis oleh seorang ilmuwan. Ia bahkan mengembangkan teori tentang mekanisme penglihatan dan proses belajar.",
      },
      {
        heading: "Kehidupan yang Produktif",
        text: "Meski hidupnya dipenuhi pergolakan politik dan harus berpindah dari satu istana ke istana lain, Ibnu Sina tetap produktif menulis. Dikisahkan ia sering mendiktekan karya-karyanya dari atas punggung kuda dalam perjalanan. Ia wafat di Hamadan, Iran, pada usia 57 tahun. Makamnya masih dikunjungi hingga kini sebagai salah satu tokoh terbesar dalam sejarah ilmu pengetahuan.",
      },
    ],
  },

  "al-khawarizmi": {
    title: "Al-Khawarizmi — Bapak Aljabar",
    period: "780 – 850 M",
    category: "Tokoh & Ulama Islam",
    sections: [
      {
        heading: "Ilmuwan Agung dari Baghdad",
        text: "Muhammad ibn Musa Al-Khawarizmi lahir sekitar tahun 780 M di Khawarizm (Uzbekistan modern). Beliau bekerja di Bayt al-Hikmah (Rumah Kebijaksanaan) Baghdad di bawah patronase Khalifah Al-Ma'mun. Namanya menjadi asal kata 'algorithm' dalam bahasa Inggris — sebuah warisan linguistik yang mencerminkan betapa besar pengaruhnya dalam sejarah ilmu pengetahuan.",
      },
      {
        heading: "Kelahiran Ilmu Aljabar",
        text: "Kitab Al-Mukhtasar fi Hisab al-Jabr wal-Muqabala (Buku Ringkasan tentang Perhitungan dengan Pemulihan dan Perbandingan) yang ditulis sekitar tahun 820 M adalah karya yang melahirkan cabang matematika yang kita sebut aljabar. Kata 'al-jabr' dalam judul buku inilah yang menjadi 'algebra' dalam bahasa Latin dan Eropa. Buku ini menyediakan metode sistematis untuk memecahkan persamaan linier dan kuadratik.",
      },
      {
        heading: "Memperkenalkan Sistem Desimal",
        text: "Al-Khawarizmi juga berjasa besar dalam memperkenalkan sistem bilangan Hindu-Arab (0-9) ke dunia Islam dan kemudian ke Eropa. Karyanya tentang aritmatika, yang diterjemahkan ke bahasa Latin dengan judul Algoritmi de numero Indorum, memperkenalkan konsep angka nol dan sistem desimal kepada Eropa — revolusi matematika yang memungkinkan perkembangan sains dan teknologi modern.",
      },
      {
        heading: "Kontribusi dalam Geografi dan Astronomi",
        text: "Selain matematika, Al-Khawarizmi menulis buku geografi yang merevisi dan menyempurnakan karya Ptolemy, lengkap dengan koordinat lebih dari 2.000 kota dan fitur geografis. Ia juga menulis tabel astronomi (zij) yang digunakan untuk menghitung posisi matahari, bulan, dan planet. Pengaruhnya merentang jauh melampaui matematika — menyentuh hampir setiap cabang ilmu pengetahuan.",
      },
    ],
  },

  "ibnu-khaldun": {
    title: "Ibnu Khaldun",
    period: "1332 – 1406 M",
    category: "Tokoh & Ulama Islam",
    sections: [
      {
        heading: "Bapak Ilmu Sosiologi dan Historiografi",
        text: "Abd al-Rahman ibn Khaldun lahir di Tunis pada tahun 1332 M dari keluarga Arab terpelajar yang berasal dari Yaman. Ia dikenal sebagai salah satu pemikir terbesar dalam sejarah manusia — pelopor ilmu sosiologi, ekonomi, dan historiografi modern, lima abad sebelum para pemikir Barat seperti Auguste Comte dan Adam Smith. Arnold Toynbee menyebutnya sebagai 'karya terbesar yang pernah diciptakan oleh pikiran manusia'.",
      },
      {
        heading: "Al-Muqaddimah",
        text: "Karya agungnya, Al-Muqaddimah (Pengantar), ditulis dalam 5 bulan di Qal'at Ibn Salama pada tahun 1377 M. Buku ini adalah pengantar dari ensiklopedia sejarahnya yang lebih besar, namun justru Al-Muqaddimah yang menjadi abadi. Di dalamnya, Ibnu Khaldun menganalisis faktor-faktor yang menyebabkan bangkitnya dan runtuhnya peradaban, memperkenalkan konsep 'asabiyyah (solidaritas sosial) sebagai motor sejarah.",
      },
      {
        heading: "Teori Siklus Peradaban",
        text: "Ibnu Khaldun mengembangkan teori bahwa peradaban bergerak dalam siklus: kaum nomaden yang memiliki asabiyyah kuat menaklukkan kaum urban yang sudah lemah, kemudian mereka sendiri menjadi urban, melemah, dan akhirnya ditaklukkan oleh gelombang nomaden berikutnya. Ia juga membahas ekonomi, perpajakan (termasuk konsep yang mirip Kurva Laffer), pendidikan, dan psikologi sosial dengan cara yang sangat modern.",
      },
      {
        heading: "Kehidupan yang Penuh Pergolakan",
        text: "Ibnu Khaldun menjalani karir yang penuh pasang surut di berbagai kerajaan di Afrika Utara dan Spanyol. Ia pernah menjadi pejabat tinggi, pernah dipenjara, dan pernah hidup sebagai pengembara. Pada 1401 M, ia sempat bertemu dengan Timur Lenk (Tamerlane) setelah jatuhnya Damaskus — pertemuan yang ia catat secara detail. Ia wafat di Kairo pada 1406 M.",
      },
    ],
  },

  // ── Penyebaran Islam ────────────────────────────────────────────────────────

  "islam-di-indonesia": {
    title: "Masuknya Islam ke Indonesia",
    period: "Abad ke-7 – 16 M",
    category: "Penyebaran Islam",
    sections: [
      {
        heading: "Jalur Perdagangan dan Awal Mula",
        text: "Islam masuk ke Nusantara melalui jalur perdagangan internasional yang menghubungkan Timur Tengah, India, dan Asia Tenggara. Para pedagang Muslim dari Arab, Persia, dan Gujarat (India) telah berdagang di pelabuhan-pelabuhan Nusantara sejak abad ke-7 M. Mereka tidak hanya membawa dagangan, tetapi juga membawa ajaran Islam yang mereka perkenalkan kepada penduduk setempat melalui interaksi damai.",
      },
      {
        heading: "Kesultanan-kesultanan Pertama",
        text: "Kerajaan Islam pertama di Nusantara adalah Kesultanan Samudera Pasai di Aceh, berdiri sekitar abad ke-13 M. Diikuti oleh Kesultanan Malaka yang menjadi pusat perdagangan dan penyebaran Islam terbesar di Asia Tenggara pada abad ke-15 M. Kemudian Kesultanan Demak di Jawa berdiri pada akhir abad ke-15 M sebagai kerajaan Islam pertama di Jawa, mengakhiri dominasi Hindu-Buddha.",
      },
      {
        heading: "Peran Walisongo",
        text: "Di Jawa, penyebaran Islam sangat diwarnai oleh peran Walisongo — sembilan wali Allah yang menggunakan pendekatan kultural dan damai. Sunan Kalijaga misalnya menggunakan wayang dan gamelan sebagai media dakwah, Sunan Bonang memadukan musik tradisional dengan ajaran Islam, sementara Sunan Ampel dikenal sebagai peletak dasar pesantren. Pendekatan mereka yang menghargai budaya lokal membuat Islam diterima dengan cepat.",
      },
      {
        heading: "Indonesia — Negara Muslim Terbesar",
        text: "Proses islamisasi Nusantara berlangsung secara bertahap selama beberapa abad, berbeda-beda di setiap daerah. Hari ini Indonesia adalah negara dengan populasi Muslim terbesar di dunia — lebih dari 230 juta jiwa atau sekitar 87% penduduk. Islam di Indonesia memiliki karakter khas yang memadukan nilai-nilai universal Islam dengan kearifan budaya lokal yang beragam.",
      },
    ],
  },

  "islam-asia-tenggara": {
    title: "Islam di Asia Tenggara",
    period: "Abad ke-13 – Sekarang",
    category: "Penyebaran Islam",
    sections: [
      {
        heading: "Persebaran Melalui Perdagangan",
        text: "Islam menyebar ke Asia Tenggara terutama melalui jaringan perdagangan maritim yang menghubungkan Timur Tengah, India, dan Asia Timur. Pedagang-pedagang Muslim mendominasi jalur rempah-rempah yang sangat berharga pada abad pertengahan. Pelabuhan-pelabuhan seperti Malaka, Pasai, dan kemudian Makassar menjadi pusat pertukaran barang sekaligus pertukaran budaya dan agama.",
      },
      {
        heading: "Kesultanan-kesultanan Berpengaruh",
        text: "Kesultanan Malaka yang berdiri sekitar 1400 M adalah kerajaan Islam paling berpengaruh di Asia Tenggara. Di bawah Sultan Mansur Shah dan penguasa-penguasa berikutnya, Malaka menjadi pusat perdagangan, Islam, dan kebudayaan Melayu. Setelah Malaka jatuh ke tangan Portugis pada 1511 M, jaringan perdagangan dan dakwah Islam bergeser ke Aceh, Johor, Brunei, dan Kepulauan Maluku.",
      },
      {
        heading: "Konteks Modern",
        text: "Hari ini Islam merupakan agama mayoritas di Indonesia, Malaysia, dan Brunei, serta agama minoritas yang signifikan di Filipina (Bangsamoro), Thailand Selatan, Myanmar (Rohingya), dan Singapura. Total Muslim di Asia Tenggara mencapai lebih dari 280 juta jiwa, menjadikan kawasan ini sebagai salah satu konsentrasi Muslim terbesar di dunia.",
      },
      {
        heading: "Ciri Khas Islam Asia Tenggara",
        text: "Islam di Asia Tenggara memiliki karakter yang khas: umumnya moderat, memadukan tradisi lokal yang kaya dengan ajaran Islam, dan berkembang dalam konteks masyarakat majemuk. Tradisi pesantren di Indonesia, madrasah di Malaysia, dan pondok di Thailand menjadi institusi pendidikan Islam yang memiliki akar kuat dalam masyarakat. Gerakan-gerakan pembaruan Islam modern juga tumbuh subur di kawasan ini.",
      },
    ],
  },

  "islam-di-afrika": {
    title: "Islam di Afrika",
    period: "Abad ke-7 – Sekarang",
    category: "Penyebaran Islam",
    sections: [
      {
        heading: "Hijrah Pertama ke Habasyah",
        text: "Hubungan Islam dengan Afrika dimulai sangat awal — bahkan sebelum Hijrah ke Madinah. Pada tahun 615 M, sebagian sahabat Nabi SAW melakukan Hijrah Pertama ke Kerajaan Habasyah (Ethiopia) atas perintah Rasulullah. Raja Najasyi (Negus), seorang Kristen yang adil, melindungi kaum Muslim yang mengungsi dari penindasan Quraisy. Beberapa sahabat menetap di sana hingga bertahun-tahun.",
      },
      {
        heading: "Penaklukan Afrika Utara",
        text: "Setelah wafatnya Nabi SAW, pasukan Muslim dengan cepat menyebar ke Afrika Utara. Mesir ditaklukkan pada 641 M, Libya dan Tunisia menyusul, hingga pasukan Muslim di bawah Uqba bin Nafi' mencapai pantai Atlantik Maroko pada 682 M. Afrika Utara (Maghreb) menjadi Muslim dalam tempo yang relatif cepat, dan dari sinilah pasukan Thariq bin Ziyad menyeberang ke Spanyol.",
      },
      {
        heading: "Penyebaran ke Afrika Sub-Sahara",
        text: "Islam menyebar ke Afrika Sub-Sahara melalui beberapa jalur: kafilah perdagangan trans-Sahara, pedagang Muslim pantai Swahili di Afrika Timur, dan dakwah para ulama dan sufi. Kerajaan-kerajaan Islam yang besar seperti Mali (dengan Mansa Musa yang terkenal kaya), Songhay, dan Kanem-Bornu menjadi pusat kekuasaan dan pembelajaran Islam di Afrika Barat.",
      },
      {
        heading: "Afrika — Benua Muslim Kedua Terbesar",
        text: "Hari ini Afrika adalah benua dengan populasi Muslim terbesar kedua di dunia setelah Asia. Sekitar 600 juta Muslim tinggal di Afrika, hampir separuh penduduk benua itu. Afrika Utara hampir sepenuhnya Muslim. Negara-negara seperti Nigeria, Senegal, Mali, Somalia, dan Tanzania memiliki populasi Muslim yang sangat besar. Tradisi keilmuan Islam di Afrika, terutama di Timbuktu dan Kairo, adalah salah satu warisan peradaban terpenting dunia.",
      },
    ],
  },

  "islam-di-eropa": {
    title: "Islam di Eropa",
    period: "Abad ke-7 – Sekarang",
    category: "Penyebaran Islam",
    sections: [
      {
        heading: "Al-Andalus — 800 Tahun Kehadiran",
        text: "Kehadiran Islam di Eropa yang paling berpengaruh dimulai dengan penaklukan Spanyol pada 711 M. Selama hampir 800 tahun, Al-Andalus (Spanyol Muslim) menjadi pusat peradaban paling maju di Eropa. Sementara sebagian besar Eropa berada dalam Abad Kegelapan, kota-kota Andalusia seperti Kordoba dan Toledo memancarkan cahaya ilmu pengetahuan, seni, dan toleransi antaragama yang menjadi model bagi dunia.",
      },
      {
        heading: "Islam di Eropa Tenggara",
        text: "Selain Andalusia, Islam juga masuk ke Eropa Tenggara melalui Kekhalifahan Utsmani. Penaklukan Konstantinopel pada 1453 M, diikuti perluasan ke Balkan, membawa Islam ke wilayah yang kini menjadi Bosnia, Albania, Kosovo, dan sebagian Bulgaria, Makedonia, dan Yunani. Negara-negara ini hingga kini memiliki komunitas Muslim yang berakar kuat sejak abad ke-14 dan ke-15.",
      },
      {
        heading: "Gelombang Migrasi Modern",
        text: "Abad ke-20 membawa gelombang baru Muslim ke Eropa Barat — terutama sebagai pekerja migran pasca-Perang Dunia II dari Pakistan, Turki, Maroko, dan Aljazair, serta gelombang pengungsi dari berbagai konflik. Hari ini diperkirakan 25-30 juta Muslim tinggal di Eropa Barat. Komunitas Muslim terbesar ada di Prancis (5-6 juta), Jerman (5 juta), Inggris (3,5 juta), dan Italia (2 juta).",
      },
      {
        heading: "Warisan dan Masa Depan",
        text: "Warisan Islam di Eropa sangat luas: ratusan kata bahasa Eropa berasal dari bahasa Arab, sistem penomoran yang digunakan di seluruh dunia berasal dari matematika Islam, dan banyak konsep hukum, kedokteran, serta filsafat yang mendasari peradaban Barat disalurkan melalui karya-karya ulama Muslim. Hari ini, komunitas Muslim di Eropa sedang membangun identitas 'Muslim Eropa' yang memadukan iman dengan kewarganegaraan.",
      },
    ],
  },
};

const RELATED_ARTICLES = [
  { title: "Abu Bakar Ash-Shiddiq RA", slug: "abu-bakar-ash-shiddiq", period: "573 – 634 M" },
  { title: "Umar bin Khattab RA", slug: "umar-bin-khattab", period: "584 – 644 M" },
  { title: "Utsman bin Affan RA", slug: "utsman-bin-affan", period: "579 – 656 M" },
  { title: "Ali bin Abi Thalib RA", slug: "ali-bin-abi-thalib", period: "601 – 661 M" },
  { title: "Dinasti Umayyah", slug: "dinasti-umayyah", period: "661 – 750 M" },
  { title: "Dinasti Abbasiyah", slug: "dinasti-abbasiyah", period: "750 – 1258 M" },
  { title: "Kekhalifahan Utsmani", slug: "kekhalifahan-utsmani", period: "1299 – 1924 M" },
  { title: "Kejayaan Islam di Andalusia", slug: "islam-di-andalusia", period: "711 – 1492 M" },
  { title: "Imam Al-Ghazali", slug: "imam-al-ghazali", period: "1058 – 1111 M" },
  { title: "Ibnu Sina (Avicenna)", slug: "ibnu-sina", period: "980 – 1037 M" },
  { title: "Al-Khawarizmi", slug: "al-khawarizmi", period: "780 – 850 M" },
  { title: "Ibnu Khaldun", slug: "ibnu-khaldun", period: "1332 – 1406 M" },
  { title: "Islam di Indonesia", slug: "islam-di-indonesia", period: "Abad ke-7 M" },
  { title: "Islam di Asia Tenggara", slug: "islam-asia-tenggara", period: "Abad ke-13 M" },
  { title: "Islam di Afrika", slug: "islam-di-afrika", period: "Abad ke-7 M" },
  { title: "Islam di Eropa", slug: "islam-di-eropa", period: "Abad ke-7 M" },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = HISTORY_ARTICLES[slug];
  return {
    title: article ? `${article.title} — Sejarah Islam | Islametra` : "Sejarah Islam | Islametra",
    description: article?.sections[0]?.text?.slice(0, 160) ?? "Pelajari sejarah Islam dari para sahabat, dinasti, ulama, dan penyebaran Islam di seluruh dunia.",
    keywords: article
      ? [article.title.toLowerCase(), "sejarah islam", article.category.toLowerCase(), "islametra"]
      : ["sejarah islam", "peradaban islam"],
    openGraph: article
      ? {
          title: `${article.title} — Sejarah Islam`,
          description: article.sections[0]?.text?.slice(0, 160),
          url: `https://www.islametra.com/sejarah/${slug}`,
          type: "article",
        }
      : undefined,
  };
}

export default async function SejarahDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = HISTORY_ARTICLES[slug];

  // Article not found state
  if (!article) {
    return (
      <div style={{ backgroundColor: "var(--islametra-bg)", minHeight: "100vh" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "clamp(32px, 5vw, 64px) 28px" }}>
          <Link
            href="/sejarah"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              color: "var(--islametra-fg-dim)",
              fontFamily: "'Geist', sans-serif",
              marginBottom: 36,
              textDecoration: "none",
            }}
          >
            <ChevronLeft size={15} />
            <T id="Kembali ke Sejarah Islam" en="Back to Islamic History" />
          </Link>

          <div
            style={{
              textAlign: "center",
              padding: "80px 32px",
              borderRadius: 24,
              background: "var(--islametra-card-overlay-sm)",
              border: "1px solid var(--islametra-line)",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "oklch(0.62 0.13 155 / 0.1)",
                border: "1px solid oklch(0.62 0.13 155 / 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <Clock size={24} style={{ color: "oklch(0.78 0.13 155)" }} />
            </div>
            <h1
              style={{
                fontSize: 20,
                fontWeight: 600,
                fontFamily: "'Geist', sans-serif",
                color: "var(--islametra-fg)",
                letterSpacing: "-0.02em",
                marginBottom: 8,
              }}
            >
              <T id="Artikel Sedang Disiapkan" en="Article Coming Soon" />
            </h1>
            <p
              style={{
                fontSize: 14,
                color: "var(--islametra-fg-mute)",
                marginBottom: 24,
                lineHeight: 1.6,
              }}
            >
              <T id="Konten untuk artikel ini sedang dalam pengembangan." en="Content for this article is being developed." />
            </p>
            <Link
              href="/sejarah"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 20px",
                borderRadius: 10,
                background:
                  "linear-gradient(180deg, oklch(0.7 0.13 155) 0%, oklch(0.55 0.12 155) 100%)",
                color: "#08110b",
                fontSize: 13,
                fontWeight: 500,
                fontFamily: "'Geist', sans-serif",
                textDecoration: "none",
              }}
            >
              <T id="Lihat Artikel Lainnya" en="View Other Articles" />
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const related = RELATED_ARTICLES.filter((a) => a.slug !== slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Islametra", item: "https://www.islametra.com" },
      { "@type": "ListItem", position: 2, name: "Sejarah Islam", item: "https://www.islametra.com/sejarah" },
      { "@type": "ListItem", position: 3, name: article.title, item: `https://www.islametra.com/sejarah/${slug}` },
    ],
  };

  return (
    <div style={{ backgroundColor: "var(--islametra-bg)", minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "clamp(32px, 5vw, 64px) 28px" }}>

        {/* Back link */}
        <Link
          href="/sejarah"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            color: "var(--islametra-fg-dim)",
            fontFamily: "'Geist', sans-serif",
            marginBottom: 36,
            textDecoration: "none",
          }}
        >
          <ChevronLeft size={15} />
          Kembali ke Sejarah Islam
        </Link>

        {/* Hero card */}
        <div
          style={{
            position: "relative",
            padding: "44px 36px",
            borderRadius: 24,
            background: "var(--islametra-hero-card-bg)",
            border: "1px solid var(--islametra-line-strong)",
            textAlign: "center",
            marginBottom: 40,
            overflow: "hidden",
          }}
        >
          {/* Emerald glow */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              height: 200,
              background: "radial-gradient(ellipse, oklch(0.62 0.13 155 / 0.1), transparent 70%)",
              filter: "blur(30px)",
              pointerEvents: "none",
            }}
          />
          {/* Shimmer */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 24,
              padding: 1,
              background: "var(--islametra-shimmer-top)",
              WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative" }}>
            {/* Category badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 12px",
                borderRadius: 999,
                background: "oklch(0.62 0.13 155 / 0.1)",
                border: "1px solid oklch(0.62 0.13 155 / 0.2)",
                marginBottom: 20,
              }}
            >
              <Clock size={10} style={{ color: "oklch(0.85 0.1 155)" }} />
              <span
                style={{
                  fontSize: 10,
                  fontFamily: "'Geist Mono', monospace",
                  letterSpacing: "0.06em",
                  color: "oklch(0.85 0.1 155)",
                  textTransform: "uppercase",
                }}
              >
                {article.category}
              </span>
            </div>

            <h1
              style={{
                fontSize: "clamp(22px, 3.5vw, 32px)",
                fontWeight: 600,
                fontFamily: "'Geist', sans-serif",
                color: "var(--islametra-fg)",
                letterSpacing: "-0.02em",
                marginBottom: 10,
              }}
            >
              {article.title}
            </h1>
            <span
              style={{
                display: "inline-block",
                fontSize: 12,
                fontFamily: "'Geist Mono', monospace",
                color: "var(--islametra-fg-dim)",
                letterSpacing: "0.04em",
                padding: "4px 12px",
                borderRadius: 999,
                background: "var(--islametra-card-overlay-md)",
                border: "1px solid var(--islametra-line)",
              }}
            >
              {article.period}
            </span>
          </div>
        </div>

        {/* Article content */}
        <article style={{ display: "flex", flexDirection: "column", gap: 28, marginBottom: 48 }}>
          {article.sections.map((section, i) => (
            <div key={i}>
              {section.heading && (
                <h2
                  style={{
                    fontSize: 17,
                    fontWeight: 600,
                    fontFamily: "'Geist', sans-serif",
                    color: "var(--islametra-fg-soft)",
                    letterSpacing: "-0.01em",
                    marginBottom: 10,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: 3,
                      height: 16,
                      borderRadius: 2,
                      background: "oklch(0.62 0.13 155 / 0.7)",
                      flexShrink: 0,
                    }}
                  />
                  {section.heading}
                </h2>
              )}
              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.85,
                  color: section.heading ? "var(--islametra-fg-mute)" : "var(--islametra-fg-dim)",
                  fontFamily: "'Geist', sans-serif",
                  fontStyle: !section.heading ? "italic" : "normal",
                  borderLeft: !section.heading
                    ? "2px solid oklch(0.82 0.08 80 / 0.3)"
                    : "none",
                  paddingLeft: !section.heading ? 16 : 0,
                }}
              >
                {section.text}
              </p>
            </div>
          ))}
        </article>

        {/* Related articles */}
        {related.length > 0 && (
          <div style={{ paddingTop: 32, borderTop: "1px solid var(--islametra-line)" }}>
            <p
              style={{
                fontSize: 11,
                fontFamily: "'Geist Mono', monospace",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--islametra-fg-dim)",
                marginBottom: 16,
              }}
            >
              <T id="Artikel Terkait" en="Related Articles" />
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {related.map((a) => (
                <Link
                  key={a.slug}
                  href={`/sejarah/${a.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 16px",
                      borderRadius: 12,
                      background: "var(--islametra-card-overlay-sm)",
                      border: "1px solid var(--islametra-line)",
                      transition: "border-color 0.2s, background 0.2s",
                    }}
                  >
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 500, color: "var(--islametra-fg-soft)", fontFamily: "'Geist', sans-serif", marginBottom: 2 }}>
                        {a.title}
                      </p>
                      <p style={{ fontSize: 11, color: "var(--islametra-fg-dim)", fontFamily: "'Geist Mono', monospace" }}>
                        {a.period}
                      </p>
                    </div>
                    <ArrowRight size={14} style={{ color: "var(--islametra-fg-dim)", flexShrink: 0 }} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
