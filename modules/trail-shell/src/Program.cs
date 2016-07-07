using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrailShell {
    class Program {
        static void Main(string[] args) {
            while (true) {
                string input = Console.ReadLine();
                Console.WriteLine(generateResponse(input) + "\n\n");
            }
        }

        private static string generateResponse(string input) {
            throw new NotImplementedException();
        }
    }
}
