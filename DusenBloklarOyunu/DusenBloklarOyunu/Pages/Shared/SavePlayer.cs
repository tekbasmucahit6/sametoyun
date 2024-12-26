using Microsoft.Data.SqlClient; // SQL bağlantısı için gerekli kütüphane
using System;
using System.Data;

namespace DusenBloklarOyunu.Pages.Shared
{
    public class SavePlayer
    {
        // SqlConnection nesnesi oluşturun
        private static SqlConnection connection = new SqlConnection("Data Source=SAMETBEKIR\\SQLEXPRESS;Initial Catalog=tempdb;Integrated Security=True;Encrypt=False");

        // Bağlantı kontrolü yapan metod
        public static void CheckConnection()
        {
            try
            {
                // Eğer bağlantı kapalıysa aç
                if (connection.State == ConnectionState.Closed)
                {
                    connection.Open();
                }
            }
            catch (Exception ex)
            {
                // Hata oluşursa konsola yazdırabilir veya loglayabilirsiniz
                Console.WriteLine("Bağlantı hatası: " + ex.Message);
            }
        }

        // Bağlantıyı kapatmak için bir yöntem
        public static void CloseConnection()
        {
            try
            {
                if (connection.State == ConnectionState.Open)
                {
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Bağlantı kapatılırken bir hata oluştu: " + ex.Message);
            }
        }
    }
}
