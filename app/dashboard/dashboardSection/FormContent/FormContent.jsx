"use client";

import "./FormContent.css";

import { useState, useContext } from "react";
import { DashboardContext } from "../../context/DashboardContext";

// icons
import { FaDesktop } from "react-icons/fa";
import { HiOutlineLightBulb } from "react-icons/hi";
import { LuClock3 } from "react-icons/lu";
import { FiPlus } from "react-icons/fi";
import { MdDelete } from "react-icons/md";

import { Form, Input, InputNumber, Select, Checkbox, Button, App } from "antd";

export default function FormContent() {
  const {
    devicesData,
    setDevicesData,
    profilInfo,
    setProfilInfo,
    analysisLoading,
    analysisError,
    runAnalysis,
  } = useContext(DashboardContext);

  const { message } = App.useApp();

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

  // =========================
  // DEVICE CHANGE
  // =========================

  const handleDeviceChange = (name, value) => {
    setDeviceData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // PROFILE CHANGE
  // =========================

  const handleProfileChange = (name, value) => {
    setProfilInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // PROFILE SUBMIT
  // =========================

  const handleProfileSubmit = () => {
    if (
      !profilInfo.penghuni ||
      profilInfo.penghuni <= 0 ||
      !profilInfo.dayaListrikRumah
    ) {
      setErrorProfil("Harap lengkapi semua data yang wajib diisi.");
      return;
    }

    setErrorProfil("");

    message.success("Data berhasil disimpan");
  };

  // =========================
  // DEVICE SUBMIT
  // =========================

  const getFormData = () => {
    let hasError = false;

    // cek nama perangkat
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

    // cek quantity
    if (!deviceData.quantity || deviceData.quantity <= 0) {
      setErrorQuantity("Jumlah perangkat minimal 1");
      hasError = true;
    } else {
      setErrorQuantity("");
    }

    // cek power
    if (deviceData.estimatedPower) {
      setErrorPower("");
    } else if (!deviceData.devicePower || deviceData.devicePower <= 0) {
      setErrorPower("Masukkan daya yang valid atau gunakan estimasi daya.");
      hasError = true;
    } else {
      setErrorPower("");
    }

    // cek durasi
    if (
      deviceData.usageDuration === "" ||
      deviceData.usageDuration === null ||
      deviceData.usageDuration <= 0
    ) {
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
    setErrorQuantity("");
    setErrorPower("");
    setErrorDuration("");

    message.success("Perangkat berhasil ditambahkan");
  };

  // =========================
  // DELETE DEVICE
  // =========================

  const handleDelete = (targetIndex) => {
    const newData = devicesData.filter((_, index) => index !== targetIndex);

    setDevicesData(newData);
  };

  // =========================
  // START ANALYSIS
  // =========================

  const handleStartAnalysis = () => {
    if (
      !profilInfo.penghuni ||
      profilInfo.penghuni <= 0 ||
      !profilInfo.dayaListrikRumah
    ) {
      setErrorProfil("Harap lengkapi data profil rumah.");
      message.warning("Harap lengkapi data profil rumah.");
      return;
    }

    if (devicesData.length === 0) {
      message.error("Tambahkan minimal satu perangkat dahulu.");
      return;
    }

    setErrorProfil("");

    message.warning(
      "Jangan tutup halaman atau refresh halaman selama analisis berlangsung!",
    );

    runAnalysis();
  };

  // =========================
  // AUTO FILL
  // =========================

  const handleAutoFill = () => {
    setDevicesData([
      {
        deviceName: "AC",
        quantity: 1,
        devicePower: 500,
        estimatedPower: false,
        usageDuration: 5,
      },
      {
        deviceName: "Kulkas",
        quantity: 1,
        devicePower: 150,
        estimatedPower: false,
        usageDuration: 24,
      },
      {
        deviceName: "Televisi",
        quantity: 1,
        devicePower: 100,
        estimatedPower: false,
        usageDuration: 4,
      },
      {
        deviceName: "Rice Cooker",
        quantity: 1,
        devicePower: 300,
        estimatedPower: false,
        usageDuration: 4,
      },
      {
        deviceName: "Kipas Angin",
        quantity: 2,
        devicePower: 45,
        estimatedPower: false,
        usageDuration: 6,
      },
      {
        deviceName: "Lampu LED",
        quantity: 8,
        devicePower: 10,
        estimatedPower: false,
        usageDuration: 6,
      },
      {
        deviceName: "Mesin Cuci",
        quantity: 1,
        devicePower: 400,
        estimatedPower: false,
        usageDuration: 0.7,
      },
      {
        deviceName: "Dispenser",
        quantity: 1,
        devicePower: 300,
        estimatedPower: false,
        usageDuration: 2,
      },
      {
        deviceName: "Charger HP",
        quantity: 4,
        devicePower: 10,
        estimatedPower: false,
        usageDuration: 3,
      },
      {
        deviceName: "Laptop",
        quantity: 1,
        devicePower: 65,
        estimatedPower: false,
        usageDuration: 5,
      },
      {
        deviceName: "Setrika",
        quantity: 1,
        devicePower: 350,
        estimatedPower: false,
        usageDuration: 0.3,
      },
      {
        deviceName: "Pompa Air",
        quantity: 1,
        devicePower: 250,
        estimatedPower: false,
        usageDuration: 0.5,
      },
    ]);

    message.success("Data perangkat berhasil diisi otomatis");
  };

  return (
    <div className="analisis-page">
      <div>
        {/* =========================
            PROFIL RUMAH
        ========================= */}

        <Form
          className="home-profile-form"
          onFinish={handleProfileSubmit}
          layout="vertical"
        >
          <h2 className="title">Profil Rumah</h2>

          <p className="subtitle">
            Informasi ini membantu AI memahami pola penggunaan energi di rumah
            anda
          </p>

          <div className="home-profile-form-input-con">
            {/* JUMLAH PENGHUNI */}

            <div className="formGroup home-profile-item">
              <label>Jumlah Penghuni</label>

              <div className="inputIcon">
                <div className="quantityInput">
                  <InputNumber
                    name="penghuni"
                    value={profilInfo.penghuni}
                    onChange={(value) => handleProfileChange("penghuni", value)}
                    min={1}
                    precision={0}
                    controls={false}
                    placeholder="Contoh: 4"
                  />
                </div>
              </div>
            </div>

            {/* DAYA LISTRIK */}

            <div className="formGroup home-profile-item">
              <label>Daya Listrik Rumah</label>

              <div className="selectWrapper">
                <Select
                  placeholder="Pilih daya listrik rumah"
                  options={powerOptions}
                  value={profilInfo.dayaListrikRumah || undefined}
                  onChange={(value) =>
                    handleProfileChange("dayaListrikRumah", value)
                  }
                />
              </div>
            </div>

            {/* BIAYA LISTRIK */}

            <div className="formGroup home-profile-item">
              <label>Biaya Listrik Bulanan (opsional)</label>

              <div className="inputIcon">
                <div className="quantityInput">
                  <InputNumber
                    name="biayaListrikBulanan"
                    value={profilInfo.biayaListrikBulanan}
                    onChange={(value) =>
                      handleProfileChange("biayaListrikBulanan", value)
                    }
                    min={0}
                    precision={0}
                    controls={false}
                    placeholder="Contoh: 300000"
                    formatter={(value) =>
                      value
                        ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                        : ""
                    }
                    parser={(value) => value?.replace(/\./g, "")}
                  />
                </div>
              </div>
            </div>

            {/* PENGGUNAAN LISTRIK BULANAN */}

            <div className="formGroup home-profile-item">
              <label>Penggunaan Listrik Bulanan (opsional)</label>

              <div className="inputIcon">
                <div className="quantityInput">
                  <InputNumber
                    name="listrikBulanan"
                    value={profilInfo.listrikBulanan}
                    onChange={(value) =>
                      handleProfileChange("listrikBulanan", value)
                    }
                    min={0}
                    step={0.01}
                    precision={2}
                    controls={false}
                    placeholder="Contoh: 350 kWh"
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
                Jika Anda memasukkan penggunaan listrik bulanan, data tersebut
                akan digunakan sebagai acuan konsumsi aktual. Jika tidak diisi,
                konsumsi akan dihitung berdasarkan perangkat yang Anda masukkan.
              </p>
            </div>

            <div>
              <Button
                htmlType="submit"
                className="purple-btn"
                style={{ background: "#8E51FF" }}
              >
                Simpan
              </Button>
            </div>
          </div>

          <p className="error" style={{ margin: 0 }}>
            {errorProfil}
          </p>
        </Form>

        {/* =========================
            DEVICE SECTION
        ========================= */}

        <div className="midle-section">
          {/* DEVICE FORM */}

          <Form
            className="device-form-card"
            onFinish={getFormData}
            layout="vertical"
          >
            <div className="device-form-grid">
              <h2 className="title">Tambah Perangkat Listrik</h2>

              <p className="subtitle">
                Isi informasi perangkat yang Anda gunakan
              </p>

              {/* NAMA PERANGKAT */}

              <div className="formGroup">
                <label>Nama perangkat</label>

                <div className="inputIcon">
                  <Input
                    name="deviceName"
                    value={deviceData.deviceName}
                    onChange={(e) =>
                      handleDeviceChange("deviceName", e.target.value)
                    }
                    placeholder="Contoh: AC, Kulkas, TV"
                    suffix={<FaDesktop className="icon" />}
                  />
                </div>

                <p className="error">{errorName}</p>
              </div>

              {/* KUANTITAS */}

              <div className="formGroup">
                <label>Kuantitas</label>

                <div className="quantityInput">
                  <InputNumber
                    name="quantity"
                    value={deviceData.quantity}
                    onChange={(value) => handleDeviceChange("quantity", value)}
                    min={1}
                    precision={0}
                    controls={false}
                    placeholder="Contoh: 1"
                  />
                </div>

                <p className="error">{errorQuantity}</p>
              </div>

              {/* DAYA */}

              <div className="formGroup">
                <label>Daya (Watt/perangkat)</label>

                <div className="inputIcon">
                  <InputNumber
                    name="devicePower"
                    value={deviceData.devicePower}
                    onChange={(value) =>
                      handleDeviceChange("devicePower", value)
                    }
                    min={1}
                    precision={0}
                    controls={false}
                    placeholder="Contoh: 100"
                  />
                </div>

                <p className="error">{errorPower}</p>
              </div>

              {/* DURASI */}

              <div className="formGroup">
                <label>Waktu penggunaan (jam/hari)</label>

                <div className="inputIcon">
                  <InputNumber
                    name="usageDuration"
                    value={deviceData.usageDuration}
                    onChange={(value) =>
                      handleDeviceChange("usageDuration", value)
                    }
                    min={0.1}
                    max={24}
                    step={0.5}
                    precision={1}
                    controls={false}
                    placeholder="Contoh: 5"
                    suffix={<LuClock3 className="icon" />}
                  />
                </div>

                <p className="error">{errorDuration}</p>
              </div>
            </div>

            {/* ESTIMATED POWER */}

            <div className="checkbox">
              <Checkbox
                checked={deviceData.estimatedPower}
                onChange={(e) =>
                  handleDeviceChange("estimatedPower", e.target.checked)
                }
              >
                Saya tidak tahu daya perangkat ini
              </Checkbox>
            </div>

            {/* INFO */}

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

            <Button htmlType="submit" className="purple-btn" icon={<FiPlus />}>
              Tambah ke Daftar
            </Button>
          </Form>

          {/* =========================
              DEVICE LIST
          ========================= */}

          <div className="device-list-container">
            <div className="device-list-header">
              <div>
                <h2>Daftar Perangkat</h2>
                <p>Perangkat yang telah Anda tambahkan</p>
              </div>

              <Button className="purple-btn isi-btn" onClick={handleAutoFill}>
                Isi Otomatis
              </Button>
            </div>

            <div className="device-list">
              {devicesData.map((item, index) => (
                <div key={index} className="device-card">
                  <div className="device-info">
                    <div>
                      <h3>{item.deviceName}</h3>

                      <p>
                        {item.quantity} unit •{" "}
                        {item.estimatedPower
                          ? "Estimasi"
                          : `${item.devicePower}W`}{" "}
                        • {item.usageDuration} jam/hari
                      </p>
                    </div>
                  </div>

                  <div className="device-actions">
                    <Button
                      type="text"
                      onClick={() => handleDelete(index)}
                      icon={<MdDelete size={20} color="#0C0850" />}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =========================
            START ANALYSIS
        ========================= */}

        <div className="start-analisis-button-con">
          <div>
            <p>Siap untuk analisis energi anda?</p>

            <p>
              Pastikan semua data sudah diisi dengan benar untuk hasil yang
              optimal
            </p>
          </div>

          <Button
            type="primary"
            className="to-analisis-btn purple-btn"
            onClick={handleStartAnalysis}
            loading={analysisLoading}
          >
            {analysisLoading ? "Menganalisis..." : "Lanjutkan ke Analisis →"}
          </Button>
        </div>
      </div>

      {analysisError ? (
        <p className="error" style={{ marginTop: 16 }}>
          {analysisError}
        </p>
      ) : null}
    </div>
  );
}
