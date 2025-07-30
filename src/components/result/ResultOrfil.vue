<template>
  <div
    class="min-h-screen w-full px-4 md:px-8 pt-24 pb-24 flex flex-col items-center gap-6 bg-[url('@/assets/bgquizzmates.png')] bg-center bg-repeat"
    style="background-color: #a64c8a"
  >
    <div v-if="loading" class="text-white text-xl font-bold">
      Menganalisis hasil...
    </div>
    <div v-else-if="error" class="text-center bg-white p-8 rounded-lg shadow-xl">
      <h2 class="text-2xl font-bold text-red-500 mb-2">Oops!</h2>
      <p class="text-gray-600">{{ error }}</p>
    </div>

    <template v-else>
      <div
        class="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl text-center"
      >
        <h2 class="text-2xl font-bold mb-4 text-gray-800">Orang Film</h2>
        <p class="text-gray-600 leading-relaxed">
       Peminatan Filmografi, Videografi, dan Fotografi Produksi Media berfokus pada pengembangan keterampilan konseptual dan teknis dalam memproduksi film, videografi, dan fotografi. Mahasiswa akan mempelajari berbagai aspek seperti manajemen kru & produksi, pengoprasian peralatan fotografi & videografi, skill pra-produksi, produksi, serta pasca-produksi, dan segala aspek lain dalam industri Film & Fotografi.
 </p>
      </div>

      <div class="w-full max-w-2xl flex flex-col md:flex-row items-stretch gap-6">
        
        <div class="bg-white rounded-lg shadow-xl p-6 flex items-center gap-4 md:w-2/3">
          <div class="w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
            <Pie v-if="chartData.datasets[0]?.data.length" :data="chartData" :options="chartOptions" />
          </div>
          <div class="text-left">
            <ul class="space-y-1 text-sm md:text-base text-gray-700">
              <li v-for="(studio, index) in topStudios" :key="studio.name" class="flex items-center">
                <span
                  class="w-3 h-3 rounded-full mr-2"
                  :style="{ backgroundColor: chartColors[index] }"
                ></span>
                <span>{{ studio.percentage }}% {{ studio.name }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-xl flex items-center justify-center md:w-1/3">
            <img src="@/assets/Orfil.png" alt="Logo Studio WIRE" class="w-full h-full object-cover rounded-md">
        </div>
      </div>

      <div
        class="bg-yellow-200 text-yellow-800 text-xs text-center rounded-md p-3 w-full max-w-2xl"
      >
        Jangan jadikan hasil ini sebagai acuan untuk keputusan yang akan lu ambil
        di hidup lu, ikuti kemauan kalian masing masing dan jangan ragu dalam
        mengejar mimpi kalian
      </div>
    </template>
  </div>
</template>


<script>
import { Pie } from "vue-chartjs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default {
  name: "ResultPage",
  components: {
    Pie,
  },
  data() {
    return {
      loading: true,
      error: null,
      topStudios: [], // Akan diisi dengan { name, score, percentage }
      chartColors: ["#FF6384", "#36A2EB", "#4BC0C0"], // Merah, Biru, Hijau Toska
      chartData: {
        labels: [],
        datasets: [{
          backgroundColor: [],
          data: [],
        }],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    };
  },
  created() {
    try {
      // 1. Ambil data dari localStorage menggunakan kunci 'latestQuizResult'
      const resultDataString = localStorage.getItem("latestQuizResult");
      if (!resultDataString) {
        throw new Error("Data hasil tidak ditemukan. Silakan selesaikan kuis terlebih dahulu.");
      }

      const resultData = JSON.parse(resultDataString);
      const detail = resultData.detail;

      if (!detail || Object.keys(detail).length === 0) {
        throw new Error("Format data tidak valid atau detail kosong.");
      }

      // 2. Proses data: ubah objek jadi array, filter, dan urutkan
      const sortedStudios = Object.entries(detail)
        .filter(([, score]) => score > 0) // Hanya ambil studio dengan skor positif
        .sort(([, scoreA], [, scoreB]) => scoreB - scoreA); // Urutkan dari tertinggi

      if (sortedStudios.length === 0) {
        throw new Error("Tidak ada studio dengan skor positif yang bisa ditampilkan.");
      }
      
      // 3. Ambil 3 studio teratas
      const top3 = sortedStudios.slice(0, 3);
      const totalPointsOfTop3 = top3.reduce((sum, [, score]) => sum + score, 0);

      // 4. Hitung persentase dan siapkan data untuk chart dan template
      this.topStudios = top3.map(([name, score]) => ({
        name,
        score,
        percentage: Math.round((score / totalPointsOfTop3) * 100),
      }));

      this.chartData = {
        labels: this.topStudios.map(s => s.name),
        datasets: [{
          backgroundColor: this.chartColors.slice(0, this.topStudios.length),
          data: this.topStudios.map(s => s.percentage),
        }],
      };

    } catch (e) {
      this.error = e.message;
      console.error("Gagal memproses data hasil:", e);
    } finally {
      this.loading = false;
    }
  },
};
</script>