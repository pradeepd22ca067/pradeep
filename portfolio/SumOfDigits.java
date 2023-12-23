public class SumOfDigits {
    public static void main(String[] args) {
        int number = 12345; // Change this number to calculate sum of digits for a different integer
        int sum = calculateSumOfDigits(number);
        System.out.println("The sum of digits of " + number + " is: " + sum);
    }

    // Method to calculate the sum of digits of a number
    public static int calculateSumOfDigits(int num) {
        int sum = 0;

        // Loop through each digit and add it to the sum
        while (num != 0) {
            int digit = num % 10; // Extract the last digit
            sum += digit; // Add the digit to the sum
            num /= 10; // Remove the last digit from the number
        }

        return sum;
    }
}
