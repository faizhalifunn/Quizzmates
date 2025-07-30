<template>
  <div
    class="min-h-screen w-full flex items-center justify-center p-4 bg-repeat"
    :style="{ backgroundImage: `url(${bgImage})`, backgroundColor: '#a64c8a' }"
  >
    <div class="bg-white rounded-xl shadow-2xl p-8 sm:p-12 max-w-4xl w-full">
      <h1 class="text-4xl sm:text-5xl font-semibold mb-4 pb-4 text-gray-800">
        What is <span class="font-black">Quizzmates</span> ?
      </h1>

      <p class="text-base sm:text-lg text-gray-500 leading-relaxed mb-8 pb-8">
        Personality test ala ala buat tau kamu cocok masuk studio apa di promed. Dengan banyaknya pilihan peminatan dan studio di program studi produksi media, website ini diharapkan bisa membantu lu menentukan pilihan studio di produksi media.
      </p>

      <div class="text-center">
        <button
          @click="openNameModal"
          class="px-16 py-3 bg-[#46A492] text-white font-bold rounded-lg shadow-lg border-b-4 border-[#3a8a7a] hover:bg-[#3a8a7a] hover:border-b-2 active:scale-95 transition-all"
        >
          Take the test
        </button>
      </div>
    </div>

    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-sm text-center">
        <h2 class="text-2xl text-gray-700 font-bold mb-4 pb-4">Nama lu siapa</h2>
        <form @submit.prevent="handleSubmit">
          <input
            v-model="userName"
            type="text"
            placeholder="Ketik nama di sini..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none text-gray-400 focus:ring-2 focus:ring-[#46A492]"
            required
          />
          <div class="p-2">
            <button
              type="submit"
              class="w-full px-6 py-2 bg-[#46A492] text-white font-bold rounded-lg hover:bg-[#3a8a7a] transition"
            >
              Submit
            </button>
          </div>
        </form>
        <button
          @click="closeNameModal"
          class="mt-4 text-sm text-gray-500 hover:text-gray-700"
        >
          Batal
        </button>
      </div>
    </div>
  </div>
</template>

<script>
// Impor gambar background jika Anda menyimpannya di src/assets
import bgPattern from '@/assets/bgquizzmates.png';

export default {
  name: "HomePage",
  data() {
    return {
      isModalOpen: false, // State untuk mengontrol visibilitas modal
      userName: "",       // State untuk menyimpan nama dari input
      bgImage: bgPattern, // Menyimpan path gambar untuk digunakan di template
    };
  },
  methods: {
    // Fungsi untuk membuka modal
    openNameModal() {
      this.isModalOpen = true;
    },
    // Fungsi untuk menutup modal
    closeNameModal() {
      this.isModalOpen = false;
    },
    // Fungsi yang dijalankan saat form disubmit
    handleSubmit() {
      if (this.userName.trim() === "") {
        alert("Nama tidak boleh kosong!");
        return;
      }
      
      // 1. Simpan nama ke localStorage
      localStorage.setItem('nama', this.userName);
      
      // 2. Arahkan pengguna ke halaman /quiz
      // Pastikan Anda sudah mengatur routing di aplikasi Vue Anda
      this.$router.push('/quiz');
      
      // Tutup modal setelah submit
      this.closeNameModal();
    },
  },
};
</script>