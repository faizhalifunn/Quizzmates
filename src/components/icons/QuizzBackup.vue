<template>
  <div
    class="min-h-screen font-sans text-gray-800 w-full flex items-center justify-center p-4"
    style="background-color: #a64c8a"
  >
    <div v-if="loading" class="text-white text-xl font-bold">
      Memuat pertanyaan...
    </div>

    <div v-else-if="error" class="text-center">
      <p class="text-white text-xl font-bold">Oops! Terjadi kesalahan</p>
      <p class="text-purple-200">{{ error }}</p>
    </div>

    <div
      v-else-if="paginatedQuestions.length"
      class="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-4xl text-center pb-16 mb-16"
    >
      <div class="mb-6">
        <p class="text-sm text-gray-500 mb-2">
          Halaman {{ currentPage + 1 }} dari {{ totalPages }}
        </p>
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div
            class="bg-purple-600 h-2.5 rounded-full transition-all duration-500"
            :style="{ width: progress + '%' }"
          ></div>
        </div>
      </div>
<h1></h1>
      <div class="flex flex-col gap-8">
        <div
          v-for="q in paginatedQuestions"
          :key="q.id"
          class="border border-gray-200 rounded-lg p-4"
        >
          <p class="mb-5 text-base sm:text-lg font-extrabold text-gray-800 pb-5">
            {{ q.pertanyaan }}
          </p>
          <div class="flex justify-center items-center gap-3 sm:gap-4">
            <span class="text-xs sm:text-sm text-gray-400 font-semibold"
              >Tidak Setuju</span
            >
            <label
              v-for="(pt, index) in pointScale(q.bobot)"
              :key="pt"
              class="cursor-pointer flex items-center"
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
            <span class="text-xs sm:text-sm text-gray-400 font-semibold"
              >Sangat Setuju</span
            >
          </div>
        </div>
      </div>

      <div
        class="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center"
      >
        <button
          @click="prevPage"
          :disabled="currentPage === 0"
          class="px-6 py-2 bg-gray-300 text-gray-400 rounded-lg hover:bg-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Kembali
        </button>
        <button
          @click="nextPage"
          :disabled="!areAllAnswersOnPageSelected"
          class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-bold"
        >
          {{ isLastPage ? "Kirim Jawaban" : "Lanjutkan" }}
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
    try {
      const res = await fetch(
        "https://ipun-api.vercel.app/game/getallpertanyaan"
      );
      if (!res.ok) throw new Error("Gagal mengambil data dari server.");

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
  methods: {
    pointScale(bobot) {
      if (bobot === "RENDAH") return [-3, -2, -1, 0, 1, 2, 3];
      if (bobot === "SEDANG") return [-2, -1, 0, 1, 2, 3, 4];
      if (bobot === "TINGGI") return [-1, 0, 1, 2, 3, 4, 5];
      return [0, 1, 2, 3, 4, 5, 6]; // Fallback
    },
    /**
     * NEW METHOD: Returns dynamic classes for circle style based on index.
     */
    getCircleStyle(index) {
      const sizeClasses = [
        "w-7 h-7", // Large
        "w-6 h-6",
        "w-5 h-5", // Small
        "w-4 h-4", // Center
        "w-5 h-5", // Small
        "w-6 h-6",
        "w-7 h-7", // Large
      ];

      let colorClasses = "";
      if (index <= 2) {
        // Disagree side (purple)
        colorClasses = "border-purple-500 peer-checked:bg-purple-500";
      } else if (index === 3) {
        // Neutral (gray)
        colorClasses = "border-gray-400 peer-checked:bg-gray-400";
      } else {
        // Agree side (teal)
        colorClasses = "border-teal-500 peer-checked:bg-teal-500";
      }

      return `${sizeClasses[index]} ${colorClasses}`;
    },
    async handleSubmit() {
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
        const json = await res.json();
        alert(json.message || "Jawaban berhasil dikirim!");
      } catch (e) {
        console.error("Submit gagal", e);
        alert("Terjadi kesalahan saat mengirim jawaban.");
      }
    },
    nextPage() {
      if (!this.areAllAnswersOnPageSelected) {
        alert("Harap jawab semua pertanyaan di halaman ini!");
        return;
      }
      if (this.isLastPage) {
        this.handleSubmit();
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