// Correct way to access the nested purchase data
if (response.data?.data?.purchase) {
  const makePayment = (invoiceNumber, exam) => {
    console.log(invoiceNumber);
    IremboPay.initiate({
      publicKey: "pk_live_111e50f65489462684098ebea001da06",
      invoiceNumber: invoiceNumber,
      locale: IremboPay.locale.RW,
      callback: async (err, resp) => {
        if (!err) {
          setSelectedExam(exam);
          try {
            const token = localStorage.getItem("token");
            const purchase = response.data.data.purchase;
            const purchaseId = purchase._id;

            const response = await axios.put(
              `https://congozi-backend.onrender.com/api/v1/purchases/${purchaseId}`,
              { status: "complete" },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            toast.success("Kwishyura byakunze.");
            closePopup();
            navigate(`/students/waitingexams`);
            fetchData();
          } catch (error) {
            toast.error("Kwishyura byanze.");
            console.error("Ikibazo:", error);
          }
        } else {
          toast.error("Payment failed");
          console.error("Payment error:", err);
        }
      },
    });
  };
}

const payPurchase = async () => {
  try {
    const token = localStorage.getItem("token");
    const purchasedId = paid;
    const response = await axios.get(
      `https://congozi-backend.onrender.com/api/v1/purchases/${purchasedId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);
    if (response.data?.data?.invoiceNumber) {
      const invoiceNumbers = response.data.data.invoiceNumber;
      console.log("Your invoice is:", invoiceNumbers);
    }
  } catch (error) {}
};
