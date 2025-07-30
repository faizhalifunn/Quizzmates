<template>
  <div
    class="min-h-screen font-sans text-gray-800 p-4 pt-24 pb-28 w-full flex items-center justify-center bg-[url('@/assets/bgquizzmates.png')] bg-auto bg-repeat"
    style="background-color: #a64c8a"
  >
    <div v-if="loading" class="text-white text-xl font-bold text-center">
      Memuat pertanyaan...
    </div>
    <div v-else-if="error" class="text-center bg-white p-8 rounded-xl shadow-lg">
      <p class="text-red-600 text-xl font-bold">Oops! Terjadi kesalahan</p>
      <p class="text-gray-600 mt-2">{{ error }}</p>
      <button @click="resetQuiz" class="mt-4 px-6 py-2 bg-[#A64C8A] text-white rounded-lg hover:bg-[#853c6e] transition">
        Coba Lagi
      </button>
    </div>

    <div
      v-else-if="paginatedQuestions.length"
      class="bg-white rounded-xl shadow-2xl p-4 sm:p-8 max-w-4xl text-center items-center mx-auto"
    >
      <div class="mb-6 pb-2">
        <p class="text-sm text-gray-500 mb-2">
          Halaman {{ currentPage + 1 }} dari {{ totalPages }}
        </p>
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div
            class="h-2.5 rounded-full transition-all duration-500"
            :style="{ width: progress + '%', backgroundColor: '#46A492' }"
          ></div>
        </div>
      </div>
      
      <div class="flex flex-col gap-8">
        <div
          v-for="q in paginatedQuestions"
          :key="q.id"
          class="border border-gray-200 rounded-lg p-4"
        >
          <p class="mb-5 text-base sm:text-lg font-extrabold text-gray-800">
            {{ q.pertanyaan }}
          </p>
          <div class="flex justify-center items-center gap-1 sm:gap-2">
            <span class="text-[10px] sm:text-xs text-gray-400 font-semibold text-center">Tidak<br>Setuju</span>
            
            <label
              v-for="(pt, index) in pointScale(q.bobot)"
              :key="pt"
              class="cursor-pointer flex items-center p-0.5 sm:p-1"
            >
              <input
                type="radio"
                :name="`q-${q.id}`"
                :value="pt"
                v-model.number="selectedAnswers[q.id]"
                class="hidden peer"
              />
              <div
                :class="[
                  'rounded-full border-2 transition-all transform peer-checked:scale-110',
                  getCircleStyle(index),
                ]"
              ></div>
            </label>

            <span class="text-[10px] sm:text-xs text-gray-400 font-semibold text-center">Sangat<br>Setuju</span>
          </div>
        </div>
      </div>

      <div
        class="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center"
      >
        <button
          @click="prevPage"
          :disabled="currentPage === 0 || isSubmitting"
          class="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Kembali
        </button>
        <button
          @click="nextPage"
          :disabled="!areAllAnswersOnPageSelected || isSubmitting"
          class="px-6 py-2 bg-[#46A492] text-white rounded-lg hover:bg-[#853c6e] transition disabled:opacity-50 disabled:cursor-not-allowed font-bold"
        >
          <span v-if="isSubmitting">Mengirim...</span>
          <span v-else>{{ isLastPage ? "Kirim Jawaban" : "Lanjutkan" }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      questions: [],
      selectedAnswers: {},
      currentPage: 0,
      questionsPerPage: 5,
      loading: true,
      error: null,
      isSubmitting: false, // <-- State baru untuk proses submit
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.questions.length / this.questionsPerPage);
    },
    paginatedQuestions() {
      const start = this.currentPage * this.questionsPerPage;
      const end = start + this.questionsPerPage;
      return this.questions.slice(start, end);
    },
    isLastPage() {
      return this.currentPage === this.totalPages - 1;
    },
    areAllAnswersOnPageSelected() {
      return this.paginatedQuestions.every(
        (q) => this.selectedAnswers[q.id] != null
      );
    },
    progress() {
      if (!this.totalPages) return 0;
      return ((this.currentPage + 1) / this.totalPages) * 100;
    },
  },
  async mounted() {
    this.fetchQuestions();
  },
  methods: {
    async fetchQuestions() {
      this.loading = true;
      this.error = null;
      try {
        const res = await fetch(
          "https://ipun-api.vercel.app/game/getallpertanyaan"
        );
        if (!res.ok) throw new Error("Gagal mengambil data pertanyaan dari server.");

        const { data } = await res.json();
        if (!data || data.length === 0)
          throw new Error("Tidak ada pertanyaan yang ditemukan.");

        this.questions = data;
        data.forEach((q) => {
          this.selectedAnswers[q.id] = null;
        });
      } catch (err) {
        this.error = err.message;
        console.error("Gagal fetch pertanyaan:", err);
      } finally {
        this.loading = false;
      }
    },
    resetQuiz() {
      this.currentPage = 0;
      this.selectedAnswers = {};
      this.fetchQuestions();
    },
    pointScale(bobot) {
      if (bobot === "RENDAH") return [-3, -2, -1, 0, 1, 2, 3];
      if (bobot === "SEDANG") return [-2, -1, 0, 1, 2, 3, 4];
      if (bobot === "TINGGI") return [-1, 0, 1, 2, 3, 4, 5];
      return [0, 1, 2, 3, 4, 5, 6]; // Fallback
    },
    
    getCircleStyle(index) {
      const sizeClasses = [
        "w-8 h-8 sm:w-10 sm:h-10",
        "w-7 h-7 sm:w-8 sm:h-8",
        "w-6 h-6 sm:w-7 sm:h-7",
        "w-5 h-5 sm:w-6 sm:h-6",
        "w-6 h-6 sm:w-7 sm:h-7",
        "w-7 h-7 sm:w-8 sm:h-8",
        "w-8 h-8 sm:w-10 sm:h-10",
      ];
      
      let colorClasses = "";
      if (index <= 2) {
        // DIUBAH: Warna border dan background diubah ke #A64C8A
        colorClasses = "border-[#A64C8A] peer-checked:bg-[#A64C8A]";
      } else if (index === 3) {
        colorClasses = "border-gray-400 peer-checked:bg-gray-400";
      } else {
        colorClasses = "border-teal-500 peer-checked:bg-teal-500";
      }
      return `${sizeClasses[index]} ${colorClasses}`;
    },

    // --- METODE handleSubmit YANG DIMODIFIKASI ---
    async handleSubmit() {
      this.isSubmitting = true; // Mulai proses submit
      this.error = null;

      const nama = localStorage.getItem("nama") || "Anonymous";
      const jawaban = this.questions.map((q) => ({
        studio: q.studio,
        point: this.selectedAnswers[q.id] ?? 0,
      }));

      try {
        const res = await fetch(
          "https://ipun-api.vercel.app/game/hitunghasilstudio",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nama, jawaban }),
          }
        );

        if (!res.ok) {
           const errorData = await res.json().catch(() => ({ message: 'Gagal mengirim jawaban.' }));
           throw new Error(errorData.message || 'Terjadi kesalahan pada server.');
        }
        
        const data = await res.json();
        
        // --- PERUBAHAN DI SINI ---
        // Simpan seluruh hasil ke localStorage sebelum redirect
        localStorage.setItem('latestQuizResult', JSON.stringify(data));
        
        // Cek apakah ada 'result' di dalam response
        if (data && data.result) {
          // Arahkan ke halaman hasil
          window.location.href = `/result/${data.result}`;
        } else {
          // Jika tidak ada result, anggap sebagai error
          throw new Error("Respons dari server tidak valid atau tidak lengkap.");
        }

      } catch (e) {
        console.error("Submit gagal", e);
        this.error = e.message; // Tampilkan error di UI
      } finally {
        this.isSubmitting = false; // Selesaikan proses submit (walaupun gagal)
      }
    },
    
    nextPage() {
      if (!this.areAllAnswersOnPageSelected) {
        // Bisa diganti dengan notifikasi yang lebih halus
        alert("Harap jawab semua pertanyaan di halaman ini!");
        return;
      }
      if (this.isLastPage) {
        this.handleSubmit(); // Panggil metode submit yang sudah dimodifikasi
      } else {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 0) {
        this.currentPage--;
      }
    },
  },
};
</script>
