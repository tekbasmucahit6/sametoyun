using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Collections.Generic;


namespace DusenBloklarOyunu.Pages
{
    public class IndexModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;

        // Kullanıcı adı özelliği
        public string UserName { get; private set; }
        public List<string> Leaderboard { get; private set; } = new List<string>(); // Liderlik tablosu listesi

        // Listeyi burada oyuncuların ve skorlarının saklandığı bir liste olarak kabul edelim.
        public List<string> PlayerScores { get; private set; } = new List<string>(); // Oyuncu adları ve skorları

        public IndexModel(ILogger<IndexModel> logger)
        {
            _logger = logger;
        }

        // Sayfa yüklendiğinde çağrılır
        public void OnGet()
        {


            // Kullanıcı adı boşsa bir mesaj göster
            if (string.IsNullOrEmpty(UserName))
            {
                UserName = "Henüz bir kullanıcı adı kaydedilmedi.";
            }

            // Liderlik tablosuna kullanıcı adını ekle
            if (!string.IsNullOrEmpty(UserName))
            {
                Leaderboard.Add(UserName); // Liderlik tablosuna ekle
            }

            // Oyuncuların skorlarını eklemek için (örnek veri)
            PlayerScores.Add("Samet - 100");  // Örnek: "Kullanıcı Adı - Puan"
            PlayerScores.Add("Ahmet - 150");
            PlayerScores.Add("Mehmet - 200");
        }

        // Kullanıcı adını kaydetmek için
        public IActionResult OnPost(string userName)
        {
            if (!string.IsNullOrWhiteSpace(userName))
            {

                // Başarılı mesajıyla aynı sayfaya yönlendir
                TempData["Message"] = "Kullanıcı adı başarıyla kaydedildi!";
            }
            else
            {
                TempData["Error"] = "Kullanıcı adı boş olamaz.";
            }

            // Sayfayı yeniden yükle
            return RedirectToPage();
        }
    }
}
