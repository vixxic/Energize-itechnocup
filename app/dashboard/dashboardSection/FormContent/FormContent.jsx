import "./FormContent.css";
import { useState, useContext } from "react";

import { DashboardContext } from "../../context/DashboardContext";

// icons
import { FaDesktop } from "react-icons/fa";
import { HiOutlineLightBulb } from "react-icons/hi";
import { LuClock3 } from "react-icons/lu";
import { FiChevronDown, FiMinus, FiPlus } from "react-icons/fi";
import { MdDelete } from "react-icons/md";

import { Select, App } from "antd";

export default function FormContent() {
  const {
    devicesData,
    setDevicesData,
    profilInfo,
    setProfilInfo,
    setAnalysis,
    analysisLoading,
    setAnalysisLoading,
    analysisError,
    setAnalysisError,
    runAnalysis,
    setCurrentMenu,
  } = useContext(DashboardContext);

  const { message } = App.useApp();

  const powerOptions = [
    { value: "450", label: "450 VA" },
    { value: "900", label: "900 VA" },
    { value: "1300", label: "1300 VA" },
    { value: "2200", label: "2200 VA" },
    { value: "3500", label: "3500 VA" },
    { value: "4400", label: "4400 VA" },
    { value: "5500", label: "5500 VA" },
    { value: "6600", label: "6600 VA" },
  ];

  // error
  const [errorName, setErrorName] = useState("");
  const [errorQuantity, setErrorQuantity] = useState("");
  const [errorPower, setErrorPower] = useState("");
  const [errorDuration, setErrorDuration] = useState("");
  const [errorProfil, setErrorProfil] = useState("");

  const [deviceData, setDeviceData] = useState({
    deviceName: "",
    quantity: 1,
    devicePower: "",
    estimatedPower: false,
    usageDuration: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setDeviceData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : type === "number" ? value === "" ? "" : Number(value) : value,
    }));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfilInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();

    if (profilInfo.penghuni <= 0 || !profilInfo.dayaListrikRumah) {
      setErrorProfil("Harap lengkapi semua data yang wajib diisi.");
      return;
    }

    setErrorProfil("");
  };

  const getFormData = (e) => {
    e.preventDefault();
    let hasError = false;

    // cek error name
    const regex = /^(?=.*[a-zA-Z])[a-zA-Z0-9\s/-]{2,50}$/;

    if (!deviceData.deviceName.trim()) {
      setErrorName("Masukkan nama perangkat terlebih dahulu.");
      hasError = true;
    } else if (!regex.test(deviceData.deviceName)) {
      setErrorName(
        "Nama perangkat hanya boleh berisi huruf, angka, spasi, garis miring (/), tanda hubung (-) dan minimal 2 karakter.",
      );
      hasError = true;
    } else {
      setErrorName("");
    }

    // cek error quantity
    if (deviceData.quantity <= 0) {
      setErrorQuantity("Jumlah perangkat minimal 1");
      hasError = true;
    } else {
      setErrorQuantity("");
    }

    // cek error power
    if (deviceData.estimatedPower) {
      setErrorPower("");
    } else if (deviceData.devicePower <= 0) {
      setErrorPower("Masukkan daya yang valid atau gunakan estimasi daya.");
      hasError = true;
    } else {
      setErrorPower("");
    }

    // cek duration usage
    if (deviceData.usageDuration <= 0) {
      setErrorDuration("Durasi penggunaan harus lebih dari 0 jam.");
      hasError = true;
    } else {
      setErrorDuration("");
    }

    if (hasError) {
      return;
    }

    setDevicesData((prev) => [...prev, deviceData]);

    setDeviceData({
      deviceName: "",
      quantity: 1,
      devicePower: "",
      estimatedPower: false,
      usageDuration: "",
    });

    setErrorName("");
  };

  const handleDelete = (targetIndex) => {
    const newobj = devicesData.filter((_, index) => index !== targetIndex);

    setDevicesData(newobj);
  };

  const handleStartAnalysis = () => {
    if (profilInfo.penghuni <= 0 || !profilInfo.dayaListrikRumah) {
      setErrorProfil("Harap lengkapi data profil rumah.");
      message.warning(
        "Harap lengkapi data profil rumah.",
      );
      return;
    }
    setErrorProfil("")
    message.warning(
      "Jangan tutup halaman atau refresh halaman selama analisis berlangsung!",
    );
    runAnalysis();
  };

  return (
    <div className="analisis-page">
      <form onSubmit={handleProfileSubmit} className="home-profile-form">
        <h2 className="title">Profil Rumah</h2>

        <p className="subtitle">
          Informasi ini membantu AI memahami pola penggunaan energi di rumah
          anda
        </p>

        <div className="home-profile-form-input-con">
          <div className="formGroup home-profile-item">
            <label>Jumlah Penghuni</label>

            <div className="inputIcon">
              <div className="quantityInput">
                <input
                  name="penghuni"
                  value={profilInfo.penghuni}
                  onChange={handleProfileChange}
                  min={1}
                  type="number"
                />
              </div>
            </div>
          </div>

          <div className="formGroup home-profile-item">
            <label>Daya Listrik Rumah</label>

            <div className="selectWrapper">
              <Select
                placeholder="Pilih daya listrik rumah"
                options={powerOptions}
                onChange={(value) =>
                  setProfilInfo((prev) => ({
                    ...prev,
                    dayaListrikRumah: value,
                  }))
                }
                value={profilInfo.dayaListrikRumah}
              />
            </div>
          </div>

          <div className="formGroup home-profile-item">
            <label>Biaya Listrik Bulanan (opsional)</label>

            <div className="inputIcon">
              <div className="quantityInput">
                <input
                  name="biayaListrikBulanan"
                  value={profilInfo.biayaListrikBulanan}
                  onChange={handleProfileChange}
                  min={1}
                  type="number"
                />
              </div>
            </div>
          </div>
        </div>

        <div style={{ justifyContent: "space-between" }} className="infoCard">
          <HiOutlineLightBulb className="lamp" />

          <div>
            <h4>Keterangan:</h4>

            <p style={{ margin: 0 }}>
              Kami akan memperkirakan biaya listrik berdasarkan data perangkat
              yang Anda masukkan. Hasil perhitungan mungkin berbeda dengan
              tagihan listrik sebenarnya.
            </p>
          </div>

          <div>
            <button
              type="submit"
              className="purple-btn"
              style={{ background: "#8E51FF" }}
            >
              Simpan
            </button>
          </div>
        </div>

        <p className="error" style={{ margin: 0 }}>
          {errorProfil}
        </p>
      </form>

      <div className="midle-section">
        <form className="device-form-card" onSubmit={getFormData}>
          <div className="device-form-grid">
            <h2 className="title">Tambah Perangkat Listrik</h2>

            <p className="subtitle">
              Isi informasi perangkat yang Anda gunakan
            </p>

            <div className="formGroup">
              <label>Device Name</label>

              <div className="inputIcon">
                <input
                  name="deviceName"
                  value={deviceData.deviceName}
                  onChange={handleChange}
                  type="text"
                  placeholder="Contoh: AC, Kulkas, TV"
                />
                <FaDesktop className="icon" />
              </div>

              <p className="error">{errorName}</p>
            </div>

            <div className="formGroup">
              <label>Quantity</label>

              <div className="quantityInput">
                <input
                  name="quantity"
                  value={deviceData.quantity}
                  onChange={handleChange}
                  min={1}
                  type="number"
                />
              </div>

              <p className="error">{errorQuantity}</p>
            </div>

            <div className="formGroup">
              <label>Power (Watt/perangkat)</label>

              <div className="inputIcon">
                <input
                  name="devicePower"
                  value={deviceData.devicePower}
                  onChange={handleChange}
                  type="number"
                  min={1}
                  placeholder="Contoh: 100"
                />
              </div>

              <p className="error">{errorPower}</p>
            </div>

            <div className="formGroup">
              <label>Usage Duration (hours/day)</label>

              <div className="inputIcon">
                <input
                  name="usageDuration"
                  value={deviceData.usageDuration}
                  onChange={handleChange}
                  min={1}
                  type="number"
                  placeholder="Contoh: 5"
                />
                <LuClock3 className="icon" />
              </div>

              <p className="error">{errorDuration}</p>
            </div>
          </div>

          <div className="checkbox">
            <input
              name="estimatedPower"
              checked={deviceData.estimatedPower}
              onChange={handleChange}
              type="checkbox"
              id="cek"
            />

            <label htmlFor="cek">Saya tidak tahu daya perangkat ini</label>
          </div>

          <div className="infoCard">
            <HiOutlineLightBulb className="lamp" />

            <div>
              <h4>Estimasi Daya</h4>

              <p>
                Kami akan memberikan estimasi daya berdasarkan jenis perangkat
                yang dipilih.
              </p>
            </div>
          </div>

          <button type="submit" className="purple-btn">
            <FiPlus />
            Tambah ke Daftar
          </button>
        </form>

        <div className="device-list-container">
          <div className="device-list-header">
            <h2>Daftar Perangkat</h2>
            <p>Perangkat yang telah Anda tambahkan</p>
          </div>

          <div className="device-list">
            {devicesData.map((item, index) => (
              <div key={index} className="device-card">
                <div className="device-info">
                  <div>
                    <h3>{item.deviceName}</h3>
                    <p>
                      {item.quantity} unit •{" "}
                      {item.estimatedPower ? "Estimasi " : item.devicePower}W •{" "}
                      {item.usageDuration} jam/hari
                    </p>
                  </div>
                </div>

                <div className="device-actions">
                  <button type="button" onClick={() => handleDelete(index)}>
                    <MdDelete size={20} color="#0C0850" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="start-analisis-button-con">
        <div>
          <p>Siap untuk analisis energi anda?</p>

          <p>
            Pastikan semua data sudah diisi dengan benar untuk hasil yang
            optimal
          </p>
        </div>

        <button
          type="button"
          className="to-analisis-btn purple-btn"
          onClick={handleStartAnalysis}
          disabled={analysisLoading}
        >
          {analysisLoading ? "Menganalisis..." : "Lanjutkan ke Analisis →"}
        </button>
      </div>

      {analysisError ? (
        <p className="error" style={{ marginTop: 16 }}>
          {analysisError}
        </p>
      ) : null}
    </div>
  );
}
