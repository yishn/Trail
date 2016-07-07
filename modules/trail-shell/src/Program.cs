using Etier.IconHelper;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrailShell {
    class Program {
        static void Main(string[] args) {
            while (true) {
                string input = Console.ReadLine();
                Console.WriteLine(generateResponse(input) + "\n");
            }
        }

        private static string generateResponse(string input) {
            if (input.StartsWith("extract-icon")) {
                string name = input.Substring("extract-icon".Length);
                Icon ico;

                if (name == "folder") {
                    ico = IconReader.GetFolderIcon(IconReader.IconSize.Small, IconReader.FolderType.Closed);
                } else {
                    ico = IconReader.GetFileIcon(name, IconReader.IconSize.Small, true);
                }

                return bitmapToBase64(ico.ToBitmap());
            }

            return "error";
        }

        private static string bitmapToBase64(Image image) {
            MemoryStream memory = new MemoryStream();
            image.Save(memory, ImageFormat.Bmp);
            string base64 = Convert.ToBase64String(memory.ToArray());
            memory.Close();
            memory.Dispose();
            return base64;
        }
    }
}
