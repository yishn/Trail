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
                bool small = input.Substring("extract-icon".Length + 1, 1) == "s";
                string name = input.Substring("extract-icon".Length + 3);
                Icon ico;
                IconReader.IconSize size = small ? IconReader.IconSize.Small : IconReader.IconSize.Large;

                if (name == "folder") {
                    ico = IconReader.GetFolderIcon("Folder", size, IconReader.FolderType.Open);
                } else {
                    ico = IconReader.GetFileIcon(name, size, false);
                }

                return "data:image/png;base64," + bitmapToBase64(ico.ToBitmap());
            }

            return "error";
        }

        private static string bitmapToBase64(Image image) {
            MemoryStream memory = new MemoryStream();
            image.Save(memory, ImageFormat.Png);
            string base64 = Convert.ToBase64String(memory.ToArray());
            memory.Close();
            memory.Dispose();
            return base64;
        }
    }
}
