import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PROPHETS } from "@/data/prophet-stories";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { T } from "@/components/shared/t";

interface Props {
  params: Promise<{ slug: string }>;
}

const ARABIC_NAMES: Record<string, string> = {
  adam: "آدَم",
  idris: "إِدْرِيس",
  nuh: "نُوح",
  hud: "هُود",
  shaleh: "صَالِح",
  luth: "لُوط",
  ibrahim: "إِبْرَاهِيم",
  ismail: "إِسْمَاعِيل",
  ishaq: "إِسْحَاق",
  yaqub: "يَعْقُوب",
  yusuf: "يُوسُف",
  ayyub: "أَيُّوب",
  syuaib: "شُعَيْب",
  musa: "مُوسَى",
  harun: "هَارُون",
  dzulkifli: "ذُو الكِفْل",
  dawud: "دَاوُد",
  sulaiman: "سُلَيْمَان",
  ilyas: "إِلْيَاس",
  ilyasa: "اليَسَع",
  yunus: "يُونُس",
  zakaria: "زَكَرِيَّا",
  yahya: "يَحْيَى",
  isa: "عِيسَى",
  muhammad: "مُحَمَّد",
};

const PROPHET_CONTENTS: Record<string, { sections: { heading?: string; text: string }[] }> = {
  adam: {
    sections: [
      {
        heading: "Penciptaan Manusia Pertama",
        text: "Nabi Adam AS adalah manusia pertama yang diciptakan oleh Allah SWT. Allah menciptakan Adam dari tanah liat dan meniupkan ruh ke dalamnya. Kemudian Allah memerintahkan para malaikat untuk bersujud kepada Adam, dan semua malaikat bersujud kecuali Iblis yang sombong dan menolak perintah Allah.",
      },
      {
        heading: "Kehidupan di Surga",
        text: "Allah kemudian menempatkan Adam dan istrinya Hawa di surga yang penuh kenikmatan. Mereka diperbolehkan menikmati semua yang ada di surga, kecuali satu pohon yang dilarang. Namun Iblis berhasil menggoda mereka untuk memakan buah dari pohon terlarang itu. Akibatnya, Adam dan Hawa diturunkan ke bumi.",
      },
      {
        heading: "Taubat dan Kehidupan di Bumi",
        text: "Di bumi, Adam dan Hawa bertaubat kepada Allah dengan penuh penyesalan. Allah, Yang Maha Pengampun, menerima taubat mereka. Adam kemudian menjalani kehidupan di bumi bersama keturunannya, mengajarkan kepada anak cucunya tentang keimanan kepada Allah Yang Esa dan tata cara beribadah.",
      },
      {
        text: "Allah SWT berfirman: \"Dan sungguh, Kami telah muliakan anak cucu Adam, dan Kami angkut mereka di darat dan di laut, dan Kami beri mereka rezeki dari yang baik-baik dan Kami lebihkan mereka di atas banyak makhluk yang Kami ciptakan dengan kelebihan yang sempurna.\" (QS. Al-Isra: 70)",
      },
    ],
  },
  nuh: {
    sections: [
      {
        heading: "Dakwah Selama 950 Tahun",
        text: "Nabi Nuh AS adalah rasul pertama yang diutus kepada umat manusia yang telah menyimpang dari ajaran tauhid. Beliau berdakwah kepada kaumnya selama 950 tahun, mengajak mereka kembali menyembah Allah dan meninggalkan berhala. Namun hanya sedikit yang mau beriman.",
      },
      {
        heading: "Perintah Membangun Bahtera",
        text: "Setelah bertahun-tahun berdakwah tanpa hasil, Allah memerintahkan Nuh untuk membangun sebuah bahtera besar. Kaumnya yang kafir mengejek dan menertawakannya. Namun Nuh terus membangun kapal tersebut dengan penuh keyakinan, karena Allah telah menjanjikan keselamatan bagi orang-orang beriman.",
      },
      {
        heading: "Banjir Besar dan Keselamatan",
        text: "Ketika bahtera selesai, Allah menurunkan hujan lebat selama berhari-hari dan memerintahkan bumi untuk memancarkan airnya. Banjir besar melanda dan menenggelamkan seluruh kaum yang ingkar. Nuh membawa serta orang-orang beriman dan sepasang dari setiap jenis hewan ke dalam bahteranya.",
      },
      {
        text: "Allah SWT berfirman: \"Sesungguhnya Kami telah mengutus Nuh kepada kaumnya lalu dia berkata: Wahai kaumku, sembahlah Allah, tidak ada Tuhan bagimu selain Dia. Sesungguhnya aku takut kamu akan ditimpa azab hari yang besar.\" (QS. Al-A'raf: 59)",
      },
    ],
  },
  ibrahim: {
    sections: [
      {
        heading: "Pencarian Tuhan yang Sejati",
        text: "Nabi Ibrahim AS hidup di masa ketika kaumnya menyembah berhala. Sejak kecil, Ibrahim sudah memiliki akal yang tajam untuk mempertanyakan kebenaran. Beliau mengamati bintang, bulan, dan matahari, namun menyadari bahwa semua itu tenggelam dan tidak bisa menjadi tuhan. Beliau menyatakan ketunggalan Allah dengan tegas.",
      },
      {
        heading: "Ujian dalam Api",
        text: "Ketika Ibrahim menghancurkan berhala-berhala kaumnya, Raja Namrud memerintahkan untuk membakarnya hidup-hidup. Mereka membangun api yang sangat besar. Namun Allah memerintahkan api itu: 'Jadilah dingin dan keselamatan bagi Ibrahim.' Ini adalah salah satu mukjizat terbesar dalam sejarah Islam.",
      },
      {
        heading: "Khalilullah - Kekasih Allah",
        text: "Ibrahim mendapat gelar Khalilullah (kekasih Allah) karena keimanan dan ketaatannya yang luar biasa. Ujian terberat datang ketika Allah memerintahkannya menyembelih putranya Ismail. Dengan ketundukan penuh, Ibrahim dan Ismail siap melaksanakannya, namun Allah mengganti Ismail dengan seekor domba — inilah asal mula Hari Raya Idul Adha.",
      },
      {
        text: "Allah SWT berfirman: \"Dan Allah mengambil Ibrahim sebagai kekasih-Nya.\" (QS. An-Nisa: 125)",
      },
    ],
  },
  musa: {
    sections: [
      {
        heading: "Kelahiran dan Masa Kecil",
        text: "Nabi Musa AS lahir di Mesir ketika Firaun memerintahkan pembunuhan semua bayi laki-laki Bani Israil. Allah menginspirasi ibunya untuk menghanyutkan Musa dalam peti di sungai Nil. Secara luar biasa, bayi itu ditemukan dan diangkat oleh keluarga Firaun sendiri, sehingga Musa dibesarkan di istana.",
      },
      {
        heading: "Panggilan Kenabian",
        text: "Setelah melarikan diri dari Mesir dan tinggal di Madyan selama beberapa tahun, Musa mendapat panggilan kenabian di Bukit Sinai. Allah berbicara langsung kepadanya dan memerintahkannya kembali ke Mesir untuk membebaskan Bani Israil dari perbudakan Firaun.",
      },
      {
        heading: "Melawan Firaun",
        text: "Bersama saudaranya Harun, Musa menghadap Firaun dengan membawa mukjizat dari Allah — tongkat yang berubah menjadi ular besar dan tangan yang bersinar putih. Firaun menolak dan mengadu dengan para penyihirnya, namun mukjizat Musa mengalahkan semua sihir mereka.",
      },
      {
        heading: "Pembebasan Bani Israil",
        text: "Setelah berbagai azab menimpa Mesir, Firaun akhirnya mengizinkan Bani Israil pergi. Namun kemudian ia mengejar mereka. Di tepi Laut Merah, Allah membelah laut untuk Musa dan Bani Israil, lalu menenggelamkan Firaun dan pasukannya ketika mencoba menyeberang.",
      },
    ],
  },
  isa: {
    sections: [
      {
        heading: "Kelahiran yang Mukjizat",
        text: "Nabi Isa AS lahir dari seorang ibu mulia, Maryam binti Imran, tanpa seorang ayah — sebagai tanda kekuasaan Allah. Maryam adalah wanita paling suci di antara para wanita, dan kelahiran Isa merupakan mukjizat yang menjadi tanda kebesaran Allah bagi seluruh manusia.",
      },
      {
        heading: "Mukjizat-mukjizat Isa",
        text: "Sejak bayi, Isa sudah bisa berbicara untuk membela ibunya yang difitnah. Di masa dewasa, beliau melakukan berbagai mukjizat atas izin Allah: menyembuhkan orang buta sejak lahir, menyembuhkan penyakit kusta, bahkan menghidupkan orang yang sudah meninggal. Beliau juga membuat burung dari tanah liat yang kemudian terbang atas izin Allah.",
      },
      {
        heading: "Dakwah kepada Bani Israil",
        text: "Isa diutus kepada Bani Israil untuk membenarkan Taurat dan memberi kabar gembira tentang kedatangan nabi setelahnya, yaitu Nabi Muhammad SAW. Beliau mengajarkan tentang keesaan Allah dan mengajak manusia meninggalkan kesyirikan.",
      },
      {
        text: "Allah SWT berfirman: \"Sesungguhnya perumpamaan (penciptaan) Isa di sisi Allah, adalah seperti (penciptaan) Adam. Allah menciptakan Adam dari tanah, kemudian Allah berfirman kepadanya: 'Jadilah!' Maka jadilah dia.\" (QS. Ali Imran: 59)",
      },
    ],
  },
  muhammad: {
    sections: [
      {
        heading: "Kelahiran dan Masa Muda",
        text: "Nabi Muhammad SAW lahir di Makkah pada tahun 571 M (Tahun Gajah) dari pasangan Abdullah dan Aminah. Ayahnya wafat sebelum kelahirannya, dan ibunya meninggal saat beliau berusia 6 tahun. Beliau kemudian diasuh oleh kakeknya Abdul Muthalib, lalu oleh pamannya Abu Thalib. Sejak muda, beliau dikenal dengan julukan Al-Amin (yang dapat dipercaya).",
      },
      {
        heading: "Wahyu Pertama",
        text: "Pada usia 40 tahun, Muhammad menerima wahyu pertama di Gua Hira. Malaikat Jibril datang dan merangkulnya sambil berkata 'Iqra!' (Bacalah!). Turunlah ayat pertama: 'Bacalah dengan (menyebut) nama Tuhanmu yang menciptakan...' (QS. Al-Alaq: 1-5). Ini menandai awal dari kenabian beliau.",
      },
      {
        heading: "Dakwah di Makkah",
        text: "Selama 13 tahun berdakwah di Makkah, Nabi Muhammad SAW menghadapi berbagai rintangan dan penindasan dari kaum Quraisy. Namun beliau tetap sabar dan terus menyebarkan ajaran Islam. Para sahabat yang beriman pun mengalami berbagai penyiksaan karena keimanan mereka.",
      },
      {
        heading: "Hijrah dan Pembangunan Peradaban Islam",
        text: "Pada tahun 622 M, Nabi Muhammad SAW bersama para sahabat hijrah ke Madinah. Di sana beliau membangun masjid pertama, menyatukan kaum Muhajirin dan Anshar, membuat Piagam Madinah, dan membangun masyarakat Islam yang adil. Puncaknya, pada tahun 630 M terjadi Fathul Makkah — pembebasan Kota Makkah tanpa pertumpahan darah yang berarti.",
      },
      {
        heading: "Warisan Agung",
        text: "Nabi Muhammad SAW wafat pada usia 63 tahun, setelah menunaikan Haji Wada (Haji Perpisahan) dan menyampaikan khutbah terakhirnya. Beliau meninggalkan dua warisan agung: Al-Quran sebagai firman Allah, dan hadits (sunnah) sebagai pedoman hidup umat Islam sepanjang zaman.",
      },
      {
        text: "Allah SWT berfirman: \"Dan tidaklah Kami mengutus engkau (Muhammad) melainkan sebagai rahmat bagi seluruh alam.\" (QS. Al-Anbiya: 107)",
      },
    ],
  },
  idris: {
    sections: [
      {
        heading: "Nabi yang Diangkat ke Tempat yang Tinggi",
        text: "Nabi Idris AS adalah salah satu nabi pertama yang diutus setelah Nabi Adam AS dan putranya Syits. Allah SWT mengangkat derajat Idris ke tempat yang tinggi, sebagaimana disebutkan dalam Al-Quran. Beliau dikenal sebagai orang yang sangat rajin beribadah, gemar berpuasa, dan selalu bermunajat kepada Allah.",
      },
      {
        heading: "Ilmu dan Kepandaian",
        text: "Nabi Idris AS dikenal sebagai orang yang berilmu luas. Menurut sejumlah riwayat, beliau adalah orang pertama yang menulis dengan pena dan menguasai berbagai ilmu pengetahuan termasuk astronomi dan matematika. Kaumnya yang hidup di masa awal peradaban manusia diajarkan cara bercocok tanam, menjahit pakaian, dan membangun tempat tinggal.",
      },
      {
        heading: "Kesabaran dan Keteguhan Iman",
        text: "Di tengah kaumnya yang mulai menyimpang dari ajaran tauhid warisan Nabi Adam, Idris dengan sabar berdakwah dan mengajak kembali kepada jalan yang lurus. Beliau tidak pernah lelah mengingatkan kaumnya tentang keesaan Allah dan bahaya kesyirikan. Keteguhan imannya menjadi teladan yang diabadikan dalam Al-Quran.",
      },
      {
        text: "Allah SWT berfirman: \"Dan ceritakanlah (Muhammad) kisah Idris di dalam Kitab (Al-Quran). Sesungguhnya dia adalah seorang yang sangat mencintai kebenaran dan seorang nabi. Dan Kami telah mengangkatnya ke martabat yang tinggi.\" (QS. Maryam: 56-57)",
      },
    ],
  },
  hud: {
    sections: [
      {
        heading: "Diutus kepada Kaum 'Ad",
        text: "Nabi Hud AS diutus Allah kepada kaum 'Ad, sebuah kaum yang sangat kuat dan perkasa yang tinggal di daerah Al-Ahqaf (sebelah selatan jazirah Arabia). Kaum 'Ad dikenal sebagai bangsa yang memiliki tubuh besar dan kuat, pandai membangun, serta sangat sombong dengan kekuatan dan kekayaan mereka.",
      },
      {
        heading: "Dakwah yang Ditolak",
        text: "Nabi Hud AS mengajak kaumnya untuk meninggalkan penyembahan berhala dan kembali kepada Allah Yang Maha Esa. Namun kaum 'Ad dengan angkuh menolak, bahkan mengejek dan menantang Hud. Mereka berkata bahwa tidak ada yang lebih kuat dari mereka dan tidak ada yang bisa mengalahkan mereka.",
      },
      {
        heading: "Azab Angin Topan",
        text: "Karena keingkaran mereka yang melampaui batas, Allah mengirimkan angin yang sangat kencang dan dingin selama tujuh malam delapan hari tanpa henti. Angin tersebut menghancurkan seluruh kaum 'Ad beserta bangunan megah yang mereka banggakan, kecuali Nabi Hud dan orang-orang beriman yang diselamatkan Allah.",
      },
      {
        text: "Allah SWT berfirman: \"Dan kepada kaum 'Ad (Kami utus) saudara mereka, Hud. Dia berkata, 'Wahai kaumku! Sembahlah Allah, tidak ada tuhan bagimu selain Dia. Kamu hanyalah mengada-ada.'\" (QS. Al-A'raf: 65)",
      },
    ],
  },
  shaleh: {
    sections: [
      {
        heading: "Rasul kepada Kaum Tsamud",
        text: "Nabi Shaleh AS diutus kepada kaum Tsamud, sebuah kaum Arab kuno yang tinggal di daerah Al-Hijr (sekarang disebut Mada'in Shaleh di Arab Saudi). Kaum Tsamud adalah penerus peradaban kaum 'Ad yang dikenal mahir memahat batu dan membangun rumah-rumah indah di dalam gunung.",
      },
      {
        heading: "Mukjizat Unta Betina",
        text: "Sebagai tanda kenabian, Allah mengeluarkan seekor unta betina yang luar biasa besar dari sebuah batu karang atas permintaan kaum Tsamud sendiri. Unta tersebut menjadi mukjizat sekaligus ujian bagi mereka. Allah memerintahkan agar unta itu dibiarkan merumput dengan bebas dan diberi minum dari sumber air secara bergiliran.",
      },
      {
        heading: "Pelanggaran dan Azab",
        text: "Kaum Tsamud melanggar perintah Allah dengan menyembelih unta mukjizat tersebut. Atas perbuatan durhaka itu, Nabi Shaleh memperingatkan bahwa azab akan datang tiga hari kemudian. Tepat pada hari ketiga, datanglah petir dan guntur yang dahsyat menghancurkan seluruh kaum Tsamud yang ingkar.",
      },
      {
        text: "Allah SWT berfirman: \"Dan kepada Tsamud (Kami utus) saudara mereka, Shaleh. Dia berkata, 'Wahai kaumku! Sembahlah Allah, tidak ada tuhan bagimu selain Dia. Dia telah menciptakanmu dari bumi (tanah) dan menjadikanmu pemakmurnya.'\" (QS. Hud: 61)",
      },
    ],
  },
  luth: {
    sections: [
      {
        heading: "Keponakan Nabi Ibrahim",
        text: "Nabi Luth AS adalah keponakan Nabi Ibrahim AS yang juga beriman dan mengikuti Ibrahim dalam perjalanannya. Allah kemudian mengutus Luth kepada penduduk kota Sodom (dan kota-kota sekitarnya) di daerah Yordania kuno, sebuah kaum yang telah terjerumus dalam perbuatan keji yang belum pernah dilakukan oleh siapapun sebelumnya.",
      },
      {
        heading: "Dakwah kepada Kaum Sodom",
        text: "Nabi Luth AS dengan gigih melarang kaumnya dari perbuatan keji yaitu homoseksualitas dan berbagai kemaksiatan yang telah menjadi kebiasaan mereka. Beliau berdakwah tanpa henti selama bertahun-tahun mengajak mereka kembali kepada fitrah manusia dan ketaatan kepada Allah, namun hampir tidak ada yang mau mendengarkan.",
      },
      {
        heading: "Datangnya Para Malaikat dan Azab",
        text: "Allah mengutus para malaikat dalam wujud pemuda tampan untuk menemui Luth sekaligus membuktikan kedurhakaan kaumnya. Ketika kaum Sodom mencoba berbuat jahat kepada tamu Luth, para malaikat membutakan mata mereka. Kemudian Allah menghancurkan kota-kota itu dengan membalikkan bumi dan menghujani mereka dengan batu dari tanah yang terbakar.",
      },
      {
        text: "Allah SWT berfirman: \"Maka tatkala datang azab Kami, Kami jadikan negeri kaum Luth itu yang di atas ke bawah (Kami balikkan), dan Kami hujani mereka dengan batu dari tanah yang terbakar dengan bertubi-tubi.\" (QS. Hud: 82)",
      },
    ],
  },
  ismail: {
    sections: [
      {
        heading: "Bayi yang Ditinggal di Padang Gersang",
        text: "Nabi Ismail AS lahir dari Nabi Ibrahim AS dan Siti Hajar. Ketika masih bayi, atas perintah Allah, Ibrahim membawa Ismail dan ibunya ke lembah Bakkah (Makkah) yang gersang dan tandus, lalu meninggalkan mereka di sana. Siti Hajar yang kebingungan mencari air berlari bolak-balik antara bukit Shafa dan Marwah, hingga Allah memancarkan air zamzam di dekat kaki bayi Ismail.",
      },
      {
        heading: "Ujian Penyembelihan",
        text: "Ketika Ismail telah tumbuh dewasa dan menjadi anak yang saleh, Allah menguji Ibrahim dengan memerintahkannya melalui mimpi untuk menyembelih putranya. Dengan ketundukan yang luar biasa, Ibrahim menyampaikan hal itu kepada Ismail, dan Ismail pun dengan ikhlas berkata: 'Wahai Ayah, kerjakanlah apa yang diperintahkan kepadamu.' Allah mengganti Ismail dengan seekor domba yang besar.",
      },
      {
        heading: "Pembangunan Ka'bah",
        text: "Bersama ayahnya Ibrahim AS, Nabi Ismail membangun Ka'bah — rumah Allah yang pertama di muka bumi. Mereka berdua mengangkat batu demi batu sambil berdoa: 'Ya Tuhan kami, terimalah dari kami (amal kami), sesungguhnya Engkaulah Yang Maha Mendengar lagi Maha Mengetahui.' Ka'bah yang mereka bangun menjadi pusat peribadatan umat Islam hingga hari ini.",
      },
      {
        text: "Allah SWT berfirman: \"Dan ceritakanlah (Muhammad) kisah Ismail di dalam Kitab (Al-Quran). Sesungguhnya dia adalah seorang yang benar dalam janjinya, dan dia adalah seorang rasul dan nabi.\" (QS. Maryam: 54)",
      },
    ],
  },
  ishaq: {
    sections: [
      {
        heading: "Kelahiran yang Dijanjikan",
        text: "Nabi Ishaq AS lahir dari Nabi Ibrahim AS dan istrinya Siti Sarah ketika keduanya sudah sangat tua — Ibrahim berusia sekitar 100 tahun dan Sarah berusia 90 tahun. Para malaikat menyampaikan kabar gembira ini kepada Ibrahim, dan Sarah yang mendengarnya tertawa keheranan karena menganggap hal itu mustahil. Namun Allah Maha Kuasa atas segalanya.",
      },
      {
        heading: "Kelanjutan Risalah Ibrahim",
        text: "Nabi Ishaq AS melanjutkan risalah ayahnya Nabi Ibrahim dalam menegakkan tauhid. Beliau diutus kepada Bani Kanaan dan wilayah sekitar Palestina. Dari keturunan Ishaq lahirlah banyak nabi dan rasul yang kemudian diutus kepada Bani Israil, menjadikan garis keturunannya sebagai garis kenabian yang panjang.",
      },
      {
        heading: "Ayah Nabi Yaqub",
        text: "Nabi Ishaq menikah dengan Rifqah dan dari pernikahan mereka lahir Yaqub dan Ishu. Yaqub kemudian meneruskan risalah kenabian dan mendapat gelar Israil, yang menjadi nama bagi keturunannya (Bani Israil). Dengan demikian, Ishaq menjadi mata rantai penting dalam silsilah para nabi yang diutus kepada Bani Israil.",
      },
      {
        text: "Allah SWT berfirman: \"Dan Kami berikan kepada Ibrahim, Ishaq dan Yaqub, dan Kami jadikan kenabian dan Al-Kitab pada keturunannya, dan Kami berikan kepadanya balasannya di dunia, dan sesungguhnya dia di akhirat adalah termasuk orang-orang saleh.\" (QS. Al-Ankabut: 27)",
      },
    ],
  },
  yaqub: {
    sections: [
      {
        heading: "Israil — Hamba Allah yang Taat",
        text: "Nabi Yaqub AS adalah putra Nabi Ishaq AS dan cucu Nabi Ibrahim AS. Allah memberikan beliau gelar 'Israil' yang berarti hamba Allah atau orang yang berjuang di jalan Allah. Dari dua belas putranya lahirlah dua belas suku yang kemudian dikenal sebagai Bani Israil, dan dari salah satu putranya (Yusuf) lahirlah kisah yang Allah sebut sebagai sebaik-baik kisah.",
      },
      {
        heading: "Perjalanan Penuh Ujian",
        text: "Kehidupan Nabi Yaqub penuh dengan ujian dari Allah. Salah satu ujian terberat adalah ketika putra kesayangannya, Yusuf, menghilang setelah dilempar oleh saudara-saudaranya ke dalam sumur. Bertahun-tahun Yaqub berduka dan menangisi kepergian Yusuf hingga matanya memutih karena kesedihan. Namun beliau tidak pernah berhenti berharap kepada rahmat Allah.",
      },
      {
        heading: "Reuni dengan Yusuf",
        text: "Setelah bertahun-tahun berpisah, Allah mempertemukan kembali Yaqub dengan putranya Yusuf yang telah menjadi pembesar Mesir. Air mata kebahagiaan mengalir ketika Yusuf mengusapkan bajunya ke wajah Yaqub yang buta, dan seketika penglihatan Yaqub pulih. Keluarga besar Yaqub pun pindah ke Mesir dan hidup dengan aman dan sejahtera.",
      },
      {
        text: "Allah SWT berfirman: \"Dan Kami anugerahkan kepada Ibrahim, Ishaq dan Yaqub sebagai suatu anugerah (dari Kami). Dan masing-masingnya Kami jadikan orang-orang yang saleh.\" (QS. Al-Anbiya: 72)",
      },
    ],
  },
  yusuf: {
    sections: [
      {
        heading: "Pemuda Tampan yang Diuji",
        text: "Nabi Yusuf AS adalah putra kesayangan Nabi Yaqub yang sejak kecil mendapat mimpi indah tentang sebelas bintang, matahari, dan bulan bersujud kepadanya. Kecantikan dan keistimewaannya menimbulkan kecemburuan saudara-saudaranya yang akhirnya membuang Yusuf ke dalam sumur dan mengatakan kepada ayah mereka bahwa Yusuf dimangsa serigala.",
      },
      {
        heading: "Ujian di Mesir",
        text: "Yusuf yang ditemukan oleh kafilah pedagang dijual sebagai budak di Mesir dan dibeli oleh seorang pembesar. Di sana beliau menghadapi godaan berat dari istri tuannya yang memiliki niat buruk kepadanya. Yusuf memilih dipenjara daripada melakukan perbuatan dosa. Di penjara, beliau menunjukkan kemampuannya menafsirkan mimpi.",
      },
      {
        heading: "Dari Penjara ke Istana",
        text: "Kemampuan Yusuf menafsirkan mimpi Raja Mesir mengubah nasibnya secara dramatis — dari penjara ia dipercaya menjadi bendahara kerajaan yang mengatur pangan seluruh Mesir. Beliau berhasil memimpin Mesir melewati tujuh tahun paceklik yang telah ia ramalkan sebelumnya, dan namanya pun termasyur ke seluruh penjuru negeri.",
      },
      {
        text: "Allah SWT berfirman: \"Sesungguhnya pada kisah-kisah mereka itu terdapat pengajaran bagi orang-orang yang mempunyai akal. Al-Quran itu bukanlah cerita yang dibuat-buat, akan tetapi membenarkan (kitab-kitab) yang sebelumnya dan menjelaskan segala sesuatu, dan sebagai petunjuk dan rahmat bagi kaum yang beriman.\" (QS. Yusuf: 111)",
      },
    ],
  },
  ayyub: {
    sections: [
      {
        heading: "Hamba Allah yang Paling Sabar",
        text: "Nabi Ayyub AS adalah seorang nabi yang diberi Allah kekayaan berlimpah, keluarga yang besar, dan kesehatan yang sempurna. Namun kemudian Allah mengujinya dengan penyakit yang sangat berat yang menimpa seluruh tubuhnya selama bertahun-tahun. Harta bendanya habis, keluarganya banyak yang pergi, namun Ayyub tidak pernah mengeluh kepada selain Allah.",
      },
      {
        heading: "Puncak Kesabaran",
        text: "Selama delapan belas tahun (menurut sebagian riwayat), Nabi Ayyub menanggung penyakitnya dengan penuh kesabaran dan ketabahan. Istrinya yang setia — Rahma — bekerja keras untuk menghidupi mereka berdua. Tidak sekali pun terdengar keluhan dari mulut Ayyub. Beliau tetap berzikir dan bersyukur kepada Allah dalam segala keadaan.",
      },
      {
        heading: "Kesembuhan dan Pemulihan",
        text: "Ketika ujian itu telah mencapai batasnya yang ditetapkan Allah, Ayyub berdoa dengan penuh kerendahan hati: 'Sesungguhnya aku telah ditimpa penyakit dan Engkau adalah Yang Maha Penyayang di antara para penyayang.' Allah mengabulkan doanya, menyembuhkan penyakitnya, dan mengembalikan seluruh kenikmatan yang pernah dimilikinya — bahkan melipatgandakannya.",
      },
      {
        text: "Allah SWT berfirman: \"Dan ingatlah hamba Kami Ayyub ketika dia berdoa kepada Tuhannya, 'Sesungguhnya aku telah ditimpa penyakit, dan Engkau adalah Yang Maha Penyayang di antara para penyayang.' Maka Kami kabulkan (doa)nya, lalu Kami lenyapkan penyakit yang ada padanya dan Kami kembalikan keluarganya kepadanya, dan (Kami lipat gandakan jumlah mereka) sebagai suatu rahmat dari Kami.\" (QS. Al-Anbiya: 83-84)",
      },
    ],
  },
  syuaib: {
    sections: [
      {
        heading: "Khathibul Anbiya — Orator Para Nabi",
        text: "Nabi Syuaib AS dikenal dengan gelar 'Khathibul Anbiya' (orator para nabi) karena kemampuannya yang luar biasa dalam bertutur kata dan berhujjah. Beliau diutus kepada penduduk Madyan, sebuah kaum Arab yang tinggal di barat laut jazirah Arabia, dekat pantai Laut Merah. Kaum ini dikenal gemar melakukan kecurangan dalam perdagangan dan timbang-menimbang.",
      },
      {
        heading: "Pemberantasan Kecurangan Dagang",
        text: "Salah satu misi utama Nabi Syuaib adalah memberantas praktik curang dalam perdagangan: mengurangi takaran dan timbangan, membeli dengan harga murah namun menjual dengan harga tinggi secara tidak adil, dan memanipulasi transaksi. Syuaib mengajak mereka berlaku jujur dan adil dalam setiap muamalah, karena Allah tidak menyukai kerusakan di muka bumi.",
      },
      {
        heading: "Keingkaran dan Azab",
        text: "Kaum Madyan menolak seruan Syuaib dengan angkuh dan bahkan mengancam akan mengusirnya. Mereka berkata bahwa aturan perdagangan adalah urusan mereka sendiri. Ketika keingkaran mereka sudah melampaui batas, Allah menimpakan azab yang mematikan berupa panas yang sangat menyengat lalu disusul oleh suara menggelegar yang menghancurkan.",
      },
      {
        text: "Allah SWT berfirman: \"Dan kepada (penduduk) Madyan, (Kami utus) saudara mereka Syuaib. Dia berkata, 'Wahai kaumku! Sembahlah Allah. Tidak ada tuhan bagimu selain Dia. Sungguh, telah datang kepadamu bukti yang nyata dari Tuhanmu. Sempurnakanlah takaran dan timbangan, dan janganlah kamu merugikan orang lain.'\" (QS. Al-A'raf: 85)",
      },
    ],
  },
  harun: {
    sections: [
      {
        heading: "Pendamping Setia Nabi Musa",
        text: "Nabi Harun AS adalah saudara kandung Nabi Musa AS yang juga diangkat Allah sebagai nabi. Ketika Allah memerintahkan Musa pergi menghadap Firaun, Musa meminta agar saudaranya Harun dijadikan pendamping dan pembantu dalam tugasnya karena Harun lebih fasih berbicara. Allah mengabulkan permintaan tersebut dan menjadikan Harun sebagai nabi bersama Musa.",
      },
      {
        heading: "Menjaga Bani Israil",
        text: "Ketika Musa pergi ke Bukit Sinai untuk menerima wahyu Taurat selama empat puluh malam, Harun ditinggalkan untuk menjaga dan memimpin Bani Israil. Namun dalam ketiadaan Musa, Samiri berhasil menyesatkan sebagian besar Bani Israil untuk menyembah patung anak sapi dari emas. Harun berusaha keras mencegah mereka namun tidak berdaya menghadapi kekerasan mereka.",
      },
      {
        heading: "Teladan Kelembutan",
        text: "Nabi Harun dikenal sebagai nabi yang lembut, santun, dan penuh kasih sayang. Ketika Musa kembali dari Sinai dan marah melihat kaumnya menyembah berhala, Harun dengan tenang menjelaskan bahwa ia tidak memiliki kemampuan untuk memaksa mereka. Kelembutan Harun menjadi pelengkap yang sempurna bagi ketegasan Musa dalam memimpin Bani Israil.",
      },
      {
        text: "Allah SWT berfirman: \"Dan Kami telah menganugerahkan kepadanya (Musa) sebagai rahmat Kami, saudaranya Harun, yang juga seorang nabi.\" (QS. Maryam: 53)",
      },
    ],
  },
  dzulkifli: {
    sections: [
      {
        heading: "Nabi yang Menepati Janji",
        text: "Nabi Dzulkifli AS adalah seorang nabi yang disebutkan namanya dalam Al-Quran bersama dengan para nabi yang sabar. Nama 'Dzulkifli' bermakna 'yang memiliki jaminan' atau 'yang kuat dalam memenuhi tanggungan.' Menurut beberapa riwayat, beliau mendapat gelar ini karena kesanggupannya mengemban tugas besar yang tidak bisa dipenuhi oleh orang lain.",
      },
      {
        heading: "Kesabaran yang Luar Biasa",
        text: "Dzulkifli dikenal dengan kesabarannya yang tidak tertandingi dalam menghadapi berbagai cobaan dan rintangan. Konon beliau berjanji untuk berpuasa di siang hari, shalat malam, dan tidak pernah marah dalam menjalankan tugasnya sebagai hakim dan pemimpin — dan beliau memenuhi semua janji tersebut dengan sempurna sepanjang hidupnya.",
      },
      {
        heading: "Keteguhan dalam Ibadah",
        text: "Dzulkifli selalu istiqamah dalam ibadahnya kepada Allah meski menghadapi berbagai gangguan. Dikisahkan bahwa iblis pernah mencoba mengganggunya dengan menyamar sebagai orang yang meminta bantuan di saat-saat istirahat dan ibadahnya, namun Dzulkifli tidak pernah terpancing amarah dan selalu menyelesaikan kewajibannya dengan penuh tanggung jawab.",
      },
      {
        text: "Allah SWT berfirman: \"Dan ingatlah Ismail, Ilyasa, dan Dzulkifli. Masing-masingnya termasuk orang-orang yang baik.\" (QS. Shad: 48)",
      },
    ],
  },
  dawud: {
    sections: [
      {
        heading: "Pemuda yang Mengalahkan Jalut",
        text: "Nabi Dawud AS sejak muda sudah menunjukkan keberanian dan keimanan yang luar biasa. Ketika tentara Bani Israil ketar-ketir menghadapi panglima perang Filistin yang perkasa bernama Jalut, pemuda Dawud tampil ke depan dan berhasil membunuh Jalut hanya dengan sebuah ketapel dan batu. Peristiwa ini menjadi awal kemunculannya sebagai tokoh besar.",
      },
      {
        heading: "Raja yang Dikaruniai Zabur",
        text: "Allah mengangkat Dawud menjadi raja Bani Israil sekaligus nabi dan rasul. Kepadanya Allah menurunkan kitab Zabur, yang sebagian besar berisi puji-pujian dan doa-doa kepada Allah. Dawud dikaruniai suara yang sangat merdu sehingga ketika beliau membaca Zabur, gunung-gunung dan burung-burung ikut bertasbih bersamanya.",
      },
      {
        heading: "Kekuatan dan Hikmat",
        text: "Dawud diberikan Allah hikmah dalam memutuskan perkara dan kemampuan luar biasa. Allah melembutkan besi di tangannya sehingga ia bisa membuat baju besi tanpa perlu dipanaskan terlebih dahulu. Beliau juga dikaruniai pemahaman bahasa binatang. Keadilannya dalam memimpin menjadi teladan yang disebutkan Allah dalam Al-Quran.",
      },
      {
        text: "Allah SWT berfirman: \"Dan sesungguhnya telah Kami lebihkan sebagian nabi-nabi itu atas sebagian (yang lain), dan Kami berikan Zabur kepada Dawud.\" (QS. Al-Isra: 55)",
      },
    ],
  },
  sulaiman: {
    sections: [
      {
        heading: "Kerajaan yang Tak Tertandingi",
        text: "Nabi Sulaiman AS adalah putra Nabi Dawud yang mewarisi kerajaan dan kenabian ayahnya. Beliau berdoa kepada Allah memohon kerajaan yang tidak akan diberikan kepada siapapun sesudahnya, dan Allah mengabulkan doanya. Sulaiman diberikan kekuasaan atas manusia, jin, hewan, dan angin — sebuah kerajaan yang belum pernah ada sebelumnya dan tidak akan ada sesudahnya.",
      },
      {
        heading: "Memahami Bahasa Binatang",
        text: "Di antara mukjizat Sulaiman adalah kemampuannya memahami bahasa semua binatang. Dikisahkan ketika pasukannya melewati sebuah lembah, seekor semut memperingatkan kawanannya agar masuk ke sarang supaya tidak terinjak. Sulaiman mendengar hal itu dan tersenyum, lalu bersyukur kepada Allah atas nikmat yang telah diberikan kepadanya.",
      },
      {
        heading: "Ratu Bilqis dan Hikmah Diplomasi",
        text: "Salah satu kisah terkenal Sulaiman adalah pertemuannya dengan Ratu Bilqis dari negeri Saba (Yaman). Burung Hud-hud membawa berita tentang negeri Saba yang makmur namun menyembah matahari. Sulaiman mengutus surat kepada Bilqis mengajaknya tunduk kepada Allah. Bilqis akhirnya datang kepada Sulaiman dan masuk Islam setelah menyaksikan singgasananya yang dipindahkan dalam sekejap mata.",
      },
      {
        text: "Allah SWT berfirman: \"Dia (Sulaiman) berkata, 'Wahai manusia! Kami telah diajari bahasa burung dan kami diberi segala sesuatu. Sungguh, (semua) ini benar-benar karunia yang nyata.'\" (QS. An-Naml: 16)",
      },
    ],
  },
  ilyas: {
    sections: [
      {
        heading: "Penentang Penyembahan Baal",
        text: "Nabi Ilyas AS diutus kepada Bani Israil yang telah menyimpang jauh dari ajaran tauhid dan mengganti penyembahan kepada Allah dengan penyembahan berhala Baal. Baal adalah berhala yang sangat diagungkan oleh bangsa Fenisia dan telah meresap ke dalam kehidupan Bani Israil terutama setelah pernikahan Raja Ahab dengan Izebel dari Sidon.",
      },
      {
        heading: "Perjuangan Sendirian",
        text: "Nabi Ilyas berdakwah sendirian menghadapi raja, rakyat, dan para pendeta Baal yang berjumlah ratusan. Beliau menantang para pendeta Baal untuk membuktikan siapa tuhan yang benar dalam sebuah ujian terbuka. Tuhan yang mana yang sanggup membakar sesembelihan tanpa api, dialah yang benar. Doa Ilyas dikabulkan Allah dan api langit membakar persembahannya.",
      },
      {
        heading: "Diangkat oleh Allah",
        text: "Karena ancaman Izebel yang hendak membunuhnya, Ilyas melarikan diri ke padang pasir. Allah memberinya kekuatan dan perbekalan yang cukup untuk perjalanan jauh. Pada akhirnya Allah mengangkat Ilyas ke langit dan mengabadikan namanya dengan penghormatan di antara manusia. Namanya disebutkan dua kali dalam Al-Quran sebagai tanda kemuliaan.",
      },
      {
        text: "Allah SWT berfirman: \"Dan sesungguhnya Ilyas benar-benar termasuk salah seorang rasul-rasul. (Ingatlah) ketika dia berkata kepada kaumnya, 'Mengapa kamu tidak bertakwa? Patutkah kamu menyembah Baal dan kamu tinggalkan sebaik-baik Pencipta?'\" (QS. Ash-Shaffat: 123-125)",
      },
    ],
  },
  ilyasa: {
    sections: [
      {
        heading: "Penerus Dakwah Ilyas",
        text: "Nabi Ilyasa AS adalah penerus dakwah Nabi Ilyas AS. Sejak muda, Ilyasa sudah mendekat kepada Ilyas dan belajar darinya. Ketika Ilyas hendak meninggalkan dunia, beliau memberikan jubahnya kepada Ilyasa sebagai tanda penerusan tugas kenabian. Ilyasa kemudian meneruskan misi mengajak Bani Israil kembali kepada Allah Yang Maha Esa.",
      },
      {
        heading: "Mukjizat dari Allah",
        text: "Nabi Ilyasa dikaruniai Allah berbagai mukjizat yang memperkuat kedudukannya sebagai nabi. Beliau mampu menyembuhkan orang sakit, menghidupkan orang mati atas izin Allah, dan membelah sungai Yordan untuk diseberangi. Mukjizat-mukjizat ini menjadi bukti nyata bagi Bani Israil bahwa beliau adalah utusan Allah yang harus diikuti.",
      },
      {
        heading: "Keteguhan dalam Kebenaran",
        text: "Ilyasa berdakwah dengan penuh keteguhan di tengah kondisi Bani Israil yang sering kali mudah tergoda oleh pengaruh budaya dan agama tetangga mereka. Beliau terus menegakkan syariat Allah dan memperingatkan kaumnya tentang konsekuensi meninggalkan jalan yang benar. Allah mengabadikan namanya dalam Al-Quran sebagai salah satu nabi yang termasuk orang-orang yang baik.",
      },
      {
        text: "Allah SWT berfirman: \"Dan Ismail, Ilyasa, Yunus, dan Luth. Masing-masing Kami lebihkan (derajatnya) di atas umat lain (pada masanya).\" (QS. Al-An'am: 86)",
      },
    ],
  },
  yunus: {
    sections: [
      {
        heading: "Nabi yang Meninggalkan Kaumnya",
        text: "Nabi Yunus AS diutus kepada penduduk Niniwe (kini Mosul, Irak). Setelah lama berdakwah tanpa hasil yang berarti, Yunus merasa putus asa dan pergi meninggalkan kaumnya sebelum mendapat izin dari Allah. Beliau menaiki sebuah kapal, namun kapal itu mengalami kesulitan di tengah laut dan undi dilakukan untuk menentukan siapa yang harus dilempar ke laut.",
      },
      {
        heading: "Dalam Perut Ikan Paus",
        text: "Undian jatuh kepada Yunus dan beliau pun dilempar ke laut, lalu ditelan oleh ikan paus yang besar. Di dalam perut paus yang gelap gulita, Yunus berdoa dengan penuh kerendahan hati: 'Laa ilaaha illaa anta subhaanaka innii kuntu minazh-zhalimiin' (Tidak ada tuhan selain Engkau, Maha Suci Engkau, sesungguhnya aku termasuk orang-orang yang zalim). Allah mengabulkan doanya.",
      },
      {
        heading: "Kembali dan Tobatnya Kaum",
        text: "Allah memerintahkan ikan paus memuntahkan Yunus ke tepi pantai dalam keadaan lemah. Setelah pulih, Yunus kembali kepada kaumnya di Niniwe. Luar biasanya, kaumnya yang sebelumnya ingkar telah bertobat dan beriman kepada Allah setelah melihat tanda-tanda azab yang mendekat. Seratus ribu lebih penduduk Niniwe diselamatkan Allah karena tobat mereka.",
      },
      {
        text: "Allah SWT berfirman: \"Maka kalau sekiranya dia tidak termasuk orang-orang yang banyak mengingat Allah, niscaya ia akan tetap tinggal di perut ikan itu sampai hari berbangkit.\" (QS. Ash-Shaffat: 143-144)",
      },
    ],
  },
  zakaria: {
    sections: [
      {
        heading: "Penjaga Maryam",
        text: "Nabi Zakaria AS adalah seorang nabi dan ulama Bani Israil yang hidup di masa itu. Beliau adalah suami dari Isyba (saudari Maryam binti Imran) sehingga menjadi paman Maryam. Allah mempercayakan pemeliharaan Maryam kepada Zakaria. Zakaria heran menyaksikan Maryam selalu memiliki makanan segar di mihrabnya tanpa ada yang mengantarkan, yang ternyata adalah rezeki langsung dari Allah.",
      },
      {
        heading: "Doa di Usia Tua",
        text: "Nabi Zakaria sudah sangat tua, rambutnya telah memutih, dan istrinya pun mandul sejak muda. Namun ketika menyaksikan keajaiban rezeki yang diterima Maryam, Zakaria tergerak untuk berdoa memohon keturunan. Beliau berdoa dengan merendahkan diri kepada Allah, mengakui kelemahannya namun tetap penuh harap kepada kemurahan Allah yang tidak terbatas.",
      },
      {
        heading: "Kabar Gembira Kelahiran Yahya",
        text: "Allah mengabulkan doa Zakaria dan memberi kabar gembira melalui malaikat bahwa beliau akan dikaruniai seorang putra bernama Yahya — nama yang belum pernah diberikan kepada siapapun sebelumnya. Zakaria yang heran bertanya bagaimana bisa terjadi padahal istrinya mandul dan dirinya sudah sangat tua. Allah menjawab bahwa itu mudah bagi-Nya.",
      },
      {
        text: "Allah SWT berfirman: \"(Allah berfirman), 'Hai Zakaria, sesungguhnya Kami memberi kabar gembira kepadamu akan (kelahiran) seorang anak yang namanya Yahya, yang sebelumnya Kami belum pernah menciptakan orang yang serupa dengan dia.'\" (QS. Maryam: 7)",
      },
    ],
  },
  yahya: {
    sections: [
      {
        heading: "Dikaruniai Hikmah Sejak Kecil",
        text: "Nabi Yahya AS lahir sebagai jawaban atas doa panjang ayahnya, Nabi Zakaria AS. Bahkan sebelum lahir, ia sudah mendapat salam dari Allah — sebuah kemuliaan yang luar biasa. Allah berfirman: 'Wahai Yahya, ambillah Al-Kitab (Taurat) itu dengan sungguh-sungguh.' Dan sejak kecil, Yahya sudah dikaruniai hikmah, ketaqwaan, dan kasih sayang kepada sesama.",
      },
      {
        heading: "Kezuhudan dan Ketaatan",
        text: "Nabi Yahya AS menjalani hidup yang penuh kezuhudan. Beliau tidak pernah bermaksiat kepada Allah, menjauhi segala kemewahan dunia, dan menghabiskan waktunya untuk beribadah dan berdakwah. Pakaiannya sederhana, makanannya ala kadarnya, dan tidurnya sedikit. Beliau juga dikenal sebagai orang yang sangat cinta kepada sesama dan sangat menyayangi orang-orang lemah.",
      },
      {
        heading: "Akhir Kehidupan yang Mulia",
        text: "Nabi Yahya AS menjalankan misi kenabiannya dengan mengajak Bani Israil kembali kepada ajaran yang benar dan menegakkan keadilan. Beliau tidak takut menyatakan kebenaran meski berhadapan dengan penguasa. Akhir hidupnya mengalami ujian berat, namun kematiannya pun dijamin oleh Allah sebagaimana firman-Nya: 'Salam sejahtera atasnya pada hari dia dilahirkan, pada hari dia meninggal, dan pada hari dia dibangkitkan hidup kembali.'",
      },
      {
        text: "Allah SWT berfirman: \"Hai Yahya, ambillah Al-Kitab (Taurat) itu dengan sungguh-sungguh. Dan Kami berikan kepadanya hikmah selagi dia masih kanak-kanak, dan rasa belas kasihan yang mendalam dari sisi Kami dan kesucian (dari dosa). Dan ia adalah seorang yang bertakwa.\" (QS. Maryam: 12-13)",
      },
    ],
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const prophet = PROPHETS.find((p) => p.slug === slug);
  if (!prophet) return { title: "Kisah tidak ditemukan" };
  return {
    title: `${prophet.prophetName} — Kisah Para Nabi`,
    description: prophet.excerpt,
  };
}

export default async function ProphetStoryPage({ params }: Props) {
  const { slug } = await params;
  const prophet = PROPHETS.find((p) => p.slug === slug);
  if (!prophet) notFound();

  const content = PROPHET_CONTENTS[slug];
  const arabicName = ARABIC_NAMES[slug];

  const currentIndex = PROPHETS.findIndex((p) => p.slug === slug);
  const prevProphet = PROPHETS[currentIndex - 1];
  const nextProphet = PROPHETS[currentIndex + 1];

  const related = PROPHETS.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div style={{ backgroundColor: "var(--islametra-bg)", minHeight: "100vh" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "clamp(32px, 5vw, 64px) 28px" }}>

        {/* Back link */}
        <Link
          href="/kisah-nabi"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            color: "var(--islametra-fg-dim)",
            fontFamily: "'Geist', sans-serif",
            marginBottom: 36,
            textDecoration: "none",
            transition: "color 0.2s",
          }}
        >
          <ChevronLeft size={15} />
          <T id="Kembali ke Kisah Para Nabi" en="Back to Prophet Stories" />
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
          {/* Gold glow */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              height: 200,
              background: "radial-gradient(ellipse, oklch(0.82 0.08 80 / 0.12), transparent 70%)",
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
            {/* Order badge */}
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
              <Star size={10} style={{ color: "oklch(0.85 0.1 155)" }} />
              <span
                style={{
                  fontSize: 10,
                  fontFamily: "'Geist Mono', monospace",
                  letterSpacing: "0.06em",
                  color: "oklch(0.85 0.1 155)",
                }}
              >
                <T id="Nabi ke-{order} dari 25" en="Prophet {order} of 25" values={{ order: prophet.order }} />
              </span>
            </div>

            {/* Arabic name */}
            {arabicName && (
              <p
                className="font-arabic"
                lang="ar"
                dir="rtl"
                style={{
                  fontSize: "clamp(36px, 6vw, 56px)",
                  color: "var(--islametra-gold-soft)",
                  lineHeight: 1.5,
                  marginBottom: 10,
                  opacity: 0.9,
                }}
              >
                {arabicName}
              </p>
            )}

            <h1
              style={{
                fontSize: "clamp(22px, 3.5vw, 32px)",
                fontWeight: 600,
                fontFamily: "'Geist', sans-serif",
                color: "var(--islametra-fg)",
                letterSpacing: "-0.02em",
                marginBottom: 6,
              }}
            >
              {prophet.prophetName}
            </h1>
            <p
              style={{
                fontSize: 13.5,
                color: "var(--islametra-fg-mute)",
                fontFamily: "'Geist', sans-serif",
                lineHeight: 1.6,
                maxWidth: 480,
                margin: "0 auto",
              }}
            >
              {prophet.excerpt}
            </p>
          </div>
        </div>

        {/* Article content */}
        <article
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
            marginBottom: 48,
          }}
        >
          {content
            ? content.sections.map((section, i) => (
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
              ))
            : (
                <p
                  style={{
                    fontSize: 15,
                    lineHeight: 1.85,
                    color: "var(--islametra-fg-mute)",
                    fontFamily: "'Geist', sans-serif",
                  }}
                >
                  {prophet.excerpt}
                </p>
              )}
        </article>

        {/* Prev / Next navigation */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            paddingTop: 28,
            borderTop: "1px solid var(--islametra-line)",
            marginBottom: 48,
          }}
        >
          {prevProphet ? (
            <Link href={`/kisah-nabi/${prevProphet.slug}`} style={{ textDecoration: "none", flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 16px",
                  borderRadius: 12,
                  background: "var(--islametra-card-overlay-sm)",
                  border: "1px solid var(--islametra-line)",
                  transition: "border-color 0.2s",
                }}
              >
                <ChevronLeft size={14} style={{ color: "var(--islametra-fg-dim)", flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 10, color: "var(--islametra-fg-dim)", fontFamily: "'Geist Mono', monospace", letterSpacing: "0.04em", marginBottom: 2 }}>
                    <T id="Sebelumnya" en="Previous" />
                  </p>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "var(--islametra-fg-soft)", fontFamily: "'Geist', sans-serif" }}>
                    {prevProphet.prophetName}
                  </p>
                </div>
              </div>
            </Link>
          ) : <div style={{ flex: 1 }} />}

          {nextProphet ? (
            <Link href={`/kisah-nabi/${nextProphet.slug}`} style={{ textDecoration: "none", flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 10,
                  padding: "12px 16px",
                  borderRadius: 12,
                  background: "var(--islametra-card-overlay-sm)",
                  border: "1px solid var(--islametra-line)",
                  transition: "border-color 0.2s",
                }}
              >
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 10, color: "var(--islametra-fg-dim)", fontFamily: "'Geist Mono', monospace", letterSpacing: "0.04em", marginBottom: 2 }}>
                    <T id="Berikutnya" en="Next" />
                  </p>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "var(--islametra-fg-soft)", fontFamily: "'Geist', sans-serif" }}>
                    {nextProphet.prophetName}
                  </p>
                </div>
                <ChevronRight size={14} style={{ color: "var(--islametra-fg-dim)", flexShrink: 0 }} />
              </div>
            </Link>
          ) : <div style={{ flex: 1 }} />}
        </div>

        {/* Related */}
        <div>
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
            <T id="Kisah Nabi Lainnya" en="Other Prophet Stories" />
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
            {related.map((p) => (
              <Link key={p.id} href={`/kisah-nabi/${p.slug}`} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    padding: "14px 16px",
                    borderRadius: 14,
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--islametra-line)",
                    transition: "border-color 0.2s, background 0.2s",
                  }}
                >
                  {ARABIC_NAMES[p.slug] && (
                    <p
                      className="font-arabic"
                      lang="ar"
                      dir="rtl"
                      style={{ fontSize: 18, color: "var(--islametra-gold-soft)", lineHeight: 1.5, marginBottom: 4, opacity: 0.8 }}
                    >
                      {ARABIC_NAMES[p.slug]}
                    </p>
                  )}
                  <p style={{ fontSize: 13, fontWeight: 500, color: "var(--islametra-fg-soft)", fontFamily: "'Geist', sans-serif", marginBottom: 4 }}>
                    {p.prophetName}
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: "var(--islametra-fg-dim)",
                      lineHeight: 1.5,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {p.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return PROPHETS.map((p) => ({ slug: p.slug }));
}
